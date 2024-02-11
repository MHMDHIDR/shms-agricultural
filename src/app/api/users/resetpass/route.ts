import { connectDB } from '@/app/api/utils/db'
import { genSalt, hash } from 'bcryptjs'
import email, { customEmail } from '@/app/api/utils/email'
import type { UserProps } from '@/types'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import { ComparePasswords } from '../../utils/compare-password'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    password: userNewPassword,
    resetToken,
    userOldPassword,
    userEmail,
    isRenewingPassword
  } = body

  const origin = req.headers.get('origin')

  try {
    const user = isRenewingPassword
      ? // User is renewing password
        (
          (await connectDB(`SELECT * FROM users WHERE shms_email = ?`, [
            userEmail
          ])) as UserProps[]
        )[0]
      : // Check for user
        (
          (await connectDB(`SELECT * FROM users WHERE shms_user_reset_token = ?`, [
            resetToken
          ])) as UserProps[]
        )[0]

    if (!user) {
      return new Response(
        JSON.stringify({ newPassSet: 0, message: `عفواً, لا يوجد مستخدم بهذا الحساب` }),
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    } else if (user.shms_user_account_status === 'block') {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `عفواً, حسابك محظور, يرجى التواصل مع الإدارة لإعادة تفعيل حسابك`
        }),
        {
          status: 403,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    } else if (
      new Date() >= new Date(user.shms_user_reset_token_expires!) &&
      !isRenewingPassword
    ) {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `عفواً, رابط إعادة تعيين كلمة المرور منتهي الصلاحية, يرجى إعادة طلب إعادة تعيين كلمة المرور`
        }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    } else if (resetToken === user.shms_user_reset_token && !isRenewingPassword) {
      // Hash new password
      const salt = await genSalt(10)
      const hashedPassword = await hash(userNewPassword, salt)

      await connectDB(
        `UPDATE users
            SET shms_password = ?,
                shms_user_reset_token = ?,
                shms_user_reset_token_expires = ?
            WHERE shms_id = ?;`,
        [hashedPassword, null, null, user.shms_id]
      )

      //send the user an email with a link to reset his/her password
      const emailData = {
        from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
        to: user.shms_email,
        subject: 'تم إعادة تعيين كلمة المرور بنجاح | شمس للخدمات الزراعية',
        msg: customEmail({
          title: `تم إعادة تعيين كلمة المرور بنجاح`,
          msg: `عزيزي ${user.shms_fullname}،
            <br />
            تم إعادة تعيين كلمة المرور الخاصة بك بنجاح، يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.

            <br />
            <a href="${APP_URL}/auth/signin"
              style="background: #008f1f;text-decoration: none !important;font-weight:700;margin-top:35px;color:#fff;font-size:14px;padding:10px 64px;display:inline-block;border-radius: 50px;"
              class="cta__button"
              target="_blank">
              تسجيل الدخول
            </a>
            
            <br /><br />
            إذا لم تقم بعمل هذا الإجراء، فيرجى الاتصال بنا على الفور على البريد الإلكتروني التالي: ${ADMIN_EMAIL}
            <br /><br />

            شكراً لك.
            <br /><br />
            <small>لا حاجة للرد على هذا البريد الإلكتروني.</small>`
        })
      }

      // try to send the email
      try {
        const { accepted, rejected } = await email(emailData)

        if (accepted.length > 0) {
          return new Response(
            JSON.stringify({
              message: `تم إعادة تعيين كلمة المرور بنجاح, جاري تحويلك إلى صفحة تسجيل الدخول...`,
              newPassSet: 1
            }),
            {
              headers: {
                'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
                'Content-Type': 'application/json'
              }
            }
          )
        } else if (rejected.length > 0) {
          return new Response(
            JSON.stringify({
              newPassSet: 0,
              message: `عفواً, لم يتم إرسال رسالة إعادة تعيين كلمة المرور, يرجى المحاولة مرة أخرى, وإذا استمرت المشكلة يرجى التواصل مع الإدارة
                ${rejected[0] /*.message*/}
              }`
            }),
            {
              headers: {
                'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
                'Content-Type': 'application/json'
              }
            }
          )
        }
      } catch (error) {
        return new Response(
          JSON.stringify({
            message: `Ooops!, something went wrong!: ${error} `,
            newPassSet: 0
          }),
          {
            headers: {
              'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
              'Content-Type': 'application/json'
            }
          }
        )
      }

      return new Response(
        JSON.stringify({
          message: `تم إعادة كلمة المرور، وتم إرسال بريد الكتروني لتأكيد تغيير كلمة المرور الجديدة بنجاح جاري تحويلك إلى صفحة تسجيل الدخول ...`,
          newPassSet: 1
        }),
        {
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    } else if (
      isRenewingPassword &&
      !(await ComparePasswords(user.shms_password ?? '', userOldPassword))
    ) {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `عفواً, كلمة المرور القديمة غير صحيحة, يرجى إعادة المحاولة`
        }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    } else if (
      isRenewingPassword &&
      (await ComparePasswords(user.shms_password ?? '', userOldPassword))
    ) {
      // Hash new password
      const salt = await genSalt(10)
      const hashedPassword = await hash(userNewPassword, salt)

      await connectDB(
        `UPDATE users
            SET shms_password = ?
            WHERE shms_id = ?;`,
        [hashedPassword, user.shms_id]
      )

      //send the user an email with a link to reset his/her password
      const emailData = {
        from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
        to: user.shms_email,
        subject: 'تم تغيير كلمة المرور بنجاح | شمس للخدمات الزراعية',
        msg: customEmail({
          title: `تم تغيير كلمة المرور بنجاح`,
          msg: `عزيزي ${user.shms_fullname}،
            <br />
            تم تغيير كلمة المرور الخاصة بك بنجاح، يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.

            <br />
            <a href="${APP_URL}/auth/signin"
              class="cta__button"
              style="background: #008f1f;text-decoration: none !important;font-weight:700;margin-top:35px;color:#fff;font-size:14px;padding:10px 64px;display:inline-block;border-radius: 50px;"
              target="_blank">
              تسجيل الدخول
            </a>
            
            <br /><br />
            إذا لم تقم بعمل هذا الإجراء، فيرجى الاتصال بنا على الفور على البريد الإلكتروني التالي: ${ADMIN_EMAIL}
            <br /><br />

            شكراً لك.
            <br /><br />
            <small>لا حاجة للرد على هذا البريد الإلكتروني.</small>`
        })
      }

      // try to send the email
      try {
        const { accepted, rejected } = await email(emailData)

        if (accepted.length > 0) {
          return new Response(
            JSON.stringify({
              message: `تم تغيير كلمة المرور بنجاح، سيتم تطبيق كلمة المرور الجديدة في تسجيل الدخول القادم...`,
              newPassSet: 1
            })
          )
        } else if (rejected.length > 0) {
          return new Response(
            JSON.stringify({
              newPassSet: 0,
              message: `عفواً, لم يتم إرسال رسالة تأكيد تغيير كلمة المرور, يرجى المحاولة مرة أخرى, وإذا استمرت المشكلة يرجى التواصل مع الإدارة
                ${rejected[0] /*.message*/}
              }`
            }),
            {
              headers: {
                'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
                'Content-Type': 'application/json'
              }
            }
          )
        }
      } catch (error) {
        return new Response(
          JSON.stringify({
            message: `Ooops!, something went wrong!: ${error} `,
            newPassSet: 0
          })
        )
      }

      return new Response(
        JSON.stringify({
          message: `تم إعادة كلمة المرور، وتم إرسال بريد الكتروني لتأكيد تغيير كلمة المرور الجديدة بنجاح جاري تحويلك إلى صفحة تسجيل الدخول ...`,
          newPassSet: 1
        }),
        {
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    } else {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `عفواً, رابط إعادة تعيين كلمة المرور غير صالح, يرجى إعادة طلب إعادة تعيين كلمة المرور`
        }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ message: `Ooops!, Server Error!: ${error}`, newPassSet: 0 }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

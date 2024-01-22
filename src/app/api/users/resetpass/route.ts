import { connectDB } from '../../utils/db'
import { genSalt, hash } from 'bcryptjs'
import email, { customEmail } from '../../utils/email'
import type { UserProps } from '@/types'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'

export async function POST(req: Request) {
  const body = await req.json()
  const { password: userNewPassword, resetToken } = body

  try {
    // Check for user
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_user_reset_token = ?`, [
        resetToken
      ])) as UserProps[]
    )[0]

    if (!user) {
      return new Response(
        JSON.stringify({ newPassSet: 0, message: `عفواً, لا يوجد مستخدم بهذا الحساب` })
      )
    } else if (user.shms_user_account_status === 'block') {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `عفواً, حسابك محظور, يرجى التواصل مع الإدارة لإعادة تفعيل حسابك`
        })
      )
    } else if (Number(user.shms_user_reset_token_expires) < Date.now()) {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `عفواً, رابط إعادة تعيين كلمة المرور منتهي الصلاحية, يرجى إعادة طلب إعادة تعيين كلمة المرور`
        })
      )
    } else if (resetToken === user.shms_user_reset_token) {
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
            })
          )
        } else if (rejected.length > 0) {
          return new Response(
            JSON.stringify({
              newPassSet: 0,
              message: `عفواً, لم يتم إرسال رسالة إعادة تعيين كلمة المرور, يرجى المحاولة مرة أخرى, وإذا استمرت المشكلة يرجى التواصل مع الإدارة
                ${rejected[0] /*.message*/}
              }`
            })
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
        })
      )
    } else {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `عفواً, رابط إعادة تعيين كلمة المرور غير صالح, يرجى إعادة طلب إعادة تعيين كلمة المرور`
        }),
        { status: 400 }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ message: `Ooops!, Server Error!: ${error}`, newPassSet: 0 }),
      { status: 500 }
    )
  }
}

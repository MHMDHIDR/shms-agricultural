import client from '@/../prisma/prismadb'
import { genSalt, hash } from 'bcryptjs'
import email from '@/libs/actions/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import { ComparePasswords } from '@/api/utils/compare-password'

export async function POST(req: Request) {
  const body = await req.json()
  const {
    password: userNewPassword,
    resetToken,
    userOldPassword,
    userEmail,
    isRenewingPassword
  } = body

  try {
    const user = isRenewingPassword
      ? // User is renewing password
        await client.users.findUnique({ where: { shms_email: userEmail } })
      : // Check for user
        await client.users.findFirst({ where: { shms_user_reset_token: resetToken } })

    if (!user) {
      return new Response(
        JSON.stringify({ newPassSet: 0, message: `عفواً، لا يوجد مستخدم بهذا الحساب` })
      )
    } else if (user.shms_user_account_status === 'block') {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `عفواً، حسابك محظور, يرجى التواصل مع الإدارة لإعادة تفعيل حسابك`
        })
      )
    } else if (
      new Date() >= new Date(user.shms_user_reset_token_expires!) &&
      !isRenewingPassword
    ) {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `عفواً، رابط إعادة تعيين كلمة المرور منتهي الصلاحية, يرجى إعادة طلب إعادة تعيين كلمة المرور`
        })
      )
    } else if (resetToken === user.shms_user_reset_token && !isRenewingPassword) {
      // Hash new password
      const salt = await genSalt(10)
      const hashedPassword = await hash(userNewPassword, salt)

      await client.users.update({
        where: { id: user.id },
        data: {
          shms_password: hashedPassword,
          shms_user_reset_token: null,
          shms_user_reset_token_expires: null
        }
      })

      //send the user an email with a link to signin to his/her account
      const buttonLink = APP_URL + `/auth/signin`

      //send the user an email with a link to reset his/her password
      const emailData = {
        from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
        to: user.shms_email,
        subject: 'تم إعادة تعيين كلمة المرور بنجاح | شمس للخدمات الزراعية',
        msg: {
          title: `تم إعادة تعيين كلمة المرور بنجاح`,
          msg: `عزيزي ${user.shms_fullname}،
            <br />
            تم إعادة تعيين كلمة المرور الخاصة بك بنجاح، يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
            
            <br /><br />
            إذا لم تقم بعمل هذا الإجراء، فيرجى الاتصال بنا على الفور على البريد الإلكتروني التالي: ${ADMIN_EMAIL}
            <br /><br />

            شكراً لك.
            <br />
            <small>لا حاجة للرد على هذا البريد الإلكتروني.</small>`,
          buttonLink,
          buttonLabel: 'تسجيل الدخول'
        }
      }

      // try to send the email
      try {
        const data = await email(emailData)
        if (data) {
          return new Response(
            JSON.stringify({
              message: `تم إعادة تعيين كلمة المرور بنجاح, جاري تحويلك إلى صفحة تسجيل الدخول...`,
              newPassSet: 1
            })
          )
        } else {
          return new Response(
            JSON.stringify({
              newPassSet: 0,
              message: `عفواً، لم يتم إرسال رسالة إعادة تعيين كلمة المرور, يرجى المحاولة مرة أخرى, وإذا استمرت المشكلة يرجى التواصل مع الإدار`
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
    } else if (
      isRenewingPassword &&
      !(await ComparePasswords(user.shms_password ?? '', userOldPassword))
    ) {
      return new Response(
        JSON.stringify({
          newPassSet: 0,
          message: `عفواً، كلمة المرور القديمة غير صحيحة, يرجى إعادة المحاولة`
        }),
        { status: 400 }
      )
    } else if (
      isRenewingPassword &&
      (await ComparePasswords(user.shms_password ?? '', userOldPassword))
    ) {
      // Hash new password
      const salt = await genSalt(10)
      const hashedPassword = await hash(userNewPassword, salt)

      await client.users.update({
        where: { id: user.id },
        data: { shms_password: hashedPassword }
      })

      const buttonLink = APP_URL + `/auth/signin`

      //send the user an email with a link to reset his/her password
      const emailData = {
        from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
        to: user.shms_email,
        subject: 'تم تغيير كلمة المرور بنجاح | شمس للخدمات الزراعية',
        msg: {
          title: `تم تغيير كلمة المرور بنجاح`,
          msg: `عزيزي ${user.shms_fullname}،
            <br />
            تم تغيير كلمة المرور الخاصة بك بنجاح، يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.

            إذا لم تقم بعمل هذا الإجراء، فيرجى الاتصال بنا على الفور على البريد الإلكتروني التالي: ${ADMIN_EMAIL}
            <br />

            شكراً لك.
            <br /><br />
            <small>لا حاجة للرد على هذا البريد الإلكتروني.</small>`,
          buttonLink,
          buttonLabel: 'تسجيل الدخول'
        }
      }

      // try to send the email
      try {
        const data = await email(emailData)
        if (data?.id) {
          return new Response(
            JSON.stringify({
              message: `تم تغيير كلمة المرور بنجاح، سيتم تطبيق كلمة المرور الجديدة في تسجيل الدخول القادم...`,
              newPassSet: 1
            })
          )
        } else {
          return new Response(
            JSON.stringify({
              newPassSet: 0,
              message: `عفواً، لم يتم إرسال رسالة تأكيد تغيير كلمة المرور, يرجى المحاولة مرة أخرى, وإذا استمرت المشكلة يرجى التواصل مع الإدارة`
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
          message: `عفواً، رابط إعادة تعيين كلمة المرور غير صالح, يرجى إعادة طلب إعادة تعيين كلمة المرور`
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

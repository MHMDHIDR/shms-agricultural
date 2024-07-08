import client from '@/../prisma/prismadb'
import email from '@/libs/actions/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import { ObjectId } from 'mongodb'

export async function POST(req: Request) {
  const body = await req.json()
  const { email: userResetEmail } = body

  try {
    // Check for user by using their email and making sure they are not deleted
    const user = await client.users.findFirst({
      where: {
        shms_email: userResetEmail,
        shms_user_is_deleted: false
      }
    })

    if (!user) {
      return new Response(
        JSON.stringify({ forgotPassSent: 0, message: `عفواً، لم يتم العثور على حسابك!` }),
        { status: 404 }
      )
    } else {
      if (user.shms_user_account_status === 'block') {
        return new Response(
          JSON.stringify({
            forgotPassSent: 0,
            message: `عفواً! حسابك محظور! لا يمكنك إعادة تعيين كلمة المرور!`
          }),
          { status: 403 }
        )
      } else if (user.shms_user_account_status === 'pending') {
        return new Response(
          JSON.stringify({
            forgotPassSent: 0,
            message: `عفواً! حسابك غير مفعل بعد! يرجى تفعيل حسابك عن طريق الرابط المرسل إلى بريدك الإلكتروني`
          }),
          { status: 403 }
        )
      } else if (new Date() < new Date(user.shms_user_reset_token_expires!)) {
        return new Response(
          JSON.stringify({
            forgotPassSent: 0,
            message: `عفواً! لديك بالفعل طلب معلق لإعادة تعيين كلمة المرور، يرجى التحقق من صندوق البريد الإلكتروني الخاص بك`
          }),
          { status: 403 }
        )
      } else {
        const userResetPasswordToken = new ObjectId().toHexString()
        const userCanResetPasswordUntil = new Date(Date.now() + 3600000).toISOString()

        await client.users.update({
          where: { id: user.id, shms_user_is_deleted: false },
          data: {
            shms_user_reset_token: userResetPasswordToken,
            shms_user_reset_token_expires: userCanResetPasswordUntil
          }
        })

        // Send the user an email with a link to reset their password
        const buttonLink = APP_URL + `/auth/reset-password/${userResetPasswordToken}`

        const emailData = {
          from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
          to: user.shms_email,
          subject: 'إعادة تعيين كلمة المرور | شمس للخدمات الزراعية',
          msg: {
            buttonLink,
            buttonLabel: 'إستعادة كلمة المرور'
          }
        }

        // Try to send the email
        try {
          const data = await email(emailData)
          if (data?.id) {
            return new Response(
              JSON.stringify({
                message: `تم إرسال رابط إعادة تعيين كلمة المرور إلى  ${user.shms_email} بنجاح! مع تعليمات إعادة تعيين كلمة المرور`,
                forgotPassSent: 1
              })
            )
          } else {
            return new Response(
              JSON.stringify({
                forgotPassSent: 0,
                message: `عفواً حدث خطأ ما!، لم يتم إرسال رابط إعادة تعيين كلمة المرور إلى  ${user.shms_email}`
              })
            )
          }
        } catch (error) {
          return new Response(
            JSON.stringify({
              message: `Ooops!, something went wrong!: ${error}`,
              forgotPassSent: 0
            })
          )
        }
      }
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: `Ooops!, something went wrong!: ${error}`,
        forgotPassSent: 0
      })
    )
  }
}

import { randomUUID } from 'crypto'
import { connectDB } from '@/api/utils/db'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import email from '@/lib/actions/email'
import type { UserProps } from '@/types'

export async function POST(req: Request) {
  const body = await req.json()
  const { email: userResetEmail } = body

  try {
    // Check for user by using his/her email or Phoneephone number
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_email = ?`, [
        userResetEmail
      ])) as UserProps[]
    )[0]

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
        const userResetPasswordToken = randomUUID()
        const userCanResetPasswordUntil = new Date(Date.now() + 3600000).toISOString()

        await connectDB(
          `UPDATE users
            SET shms_user_reset_token = ?,
                shms_user_reset_token_expires = ?
            WHERE shms_id = ?;`,
          [userResetPasswordToken, userCanResetPasswordUntil, user.shms_id]
        )

        //send the user an email with a link to reset his/her password
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

        // try to send the email
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
              message: `Ooops!, something went wrong!: ${error} `,
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

import { connectDB } from '@/app/api/utils/db'
import { randomUUID } from 'crypto'
import email, { customEmail } from '@/app/api/utils/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import type { UserProps } from '@/types'

export async function POST(req: Request) {
  const body = await req.json()
  const { userEmail } = body

  try {
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_email = ?`, [
        userEmail
      ])) as UserProps[]
    )[0]

    if (!user) {
      return new Response(
        JSON.stringify({ resetEmail: 0, message: `عفواً, لا يوجد مستخدم بهذا الحساب` })
      )
    } else if (user.shms_user_account_status === 'block') {
      return new Response(
        JSON.stringify({
          resetEmail: 0,
          message: `عفواً, حسابك محظور, يرجى التواصل مع الإدارة لإعادة تفعيل حسابك`
        })
      )
    } else if (userEmail === user.shms_email) {
      const userResetPasswordToken = randomUUID()
      const userCanResetPasswordUntil = new Date(Date.now() + 3600000).toISOString() // 1 hour from signup time

      await connectDB(
        `UPDATE users
            SET shms_email = ?,
            shms_user_account_status = ?,
            shms_user_reset_token = ?,
            shms_user_reset_token_expires = ?
            WHERE shms_id = ?;`,
        [
          userEmail,
          'pending',
          userResetPasswordToken,
          userCanResetPasswordUntil,
          user.shms_id
        ]
      )

      //send the user an email with a link to reset his/her password
      const emailData = {
        from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
        to: user.shms_email,
        subject: 'تأكيد البريد الالكتروني الجديد | شمس للخدمات الزراعية',
        msg: customEmail({
          title: `تأكيد البريد الالكتروني الجديد`,
          msg: `عزيزي ${user.shms_fullname}،
            <br />
            تم تغيير البريد الاكتروني الخاص بك بنجاح، يرجى الضعط على تأكيد البريد الالكتروني في الزر أدناه لتفعيل تسجيل الدخول باستخدام البريد الاكتروني الجديد.

            <br />
            <a href="${APP_URL}/auth/activate"
              style="background: #008f1f;text-decoration: none !important;font-weight:700;margin-top:35px;color:#fff;font-size:14px;padding:10px 64px;display:inline-block;border-radius: 50px;"
              target="_blank">
              تفعيل البريد الالكتروني الجديد
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
              message: `تم إرسال بريد الكتروني لتأكيد البريد الالكتروني الجديد، الرجاء إتباع التعليمات في البريد الالكتروني المرسل لكم في البريد الالكتروني الجديد...`,
              resetEmail: 1
            })
          )
        } else if (rejected.length > 0) {
          return new Response(
            JSON.stringify({
              resetEmail: 0,
              message: `عفواً, لم يتم إرسال رسالة تأكيد تغيير كلمة المرور, يرجى المحاولة مرة أخرى, وإذا استمرت المشكلة يرجى التواصل مع الإدارة
                ${rejected[0] /*.message*/}
              }`
            })
          )
        }
      } catch (error) {
        return new Response(
          JSON.stringify({
            message: `Ooops!, something went wrong!: ${error} `,
            resetEmail: 0
          })
        )
      }

      return new Response(
        JSON.stringify({
          message: `تم إرسال بريد الكتروني لتأكيد البريد الالكتروني الجديد، الرجاء إتباع التعليمات في البريد الالكتروني المرسل لكم في البريد الالكتروني الجديد...`,
          resetEmail: 1
        })
      )
    } else {
      return new Response(
        JSON.stringify({
          resetEmail: 0,
          message: `عفواً, حدث خطأ غير متوقع، لا يمكن تغيير البريد الالكتروني - يرجى التواصل مع الإدارة`
        }),
        { status: 400 }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ message: `Ooops!, Server Error!: ${error}`, resetEmail: 0 }),
      { status: 500 }
    )
  }
}

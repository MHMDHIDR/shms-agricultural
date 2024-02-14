import { connectDB } from '@/app/api/utils/db'
import { randomUUID } from 'crypto'
import email from '@/lib/actions/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import type { UserProps } from '@/types'

export async function PUT(req: Request) {
  const body = await req.json()
  const { userEmail, oldEmail, fullname } = body

  try {
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_email = ?`, [
        userEmail
      ])) as UserProps[]
    )[0]

    if (user && user.shms_email === userEmail) {
      return new Response(
        JSON.stringify({
          resetEmail: 0,
          message: `عفواً, البريد الالكتروني الجديد مطابق للبريد الالكتروني القديم، يرجى إستخدام بريد الكتروني آخر`
        }),
        { status: 400 }
      )
    } else if (user) {
      return new Response(
        JSON.stringify({
          resetEmail: 0,
          message: `عفواً, البريد الالكتروني مستخدم من قبل، يرجى إستخدام بريد الكتروني آخر`
        }),
        { status: 400 }
      )
    } else {
      const userResetPasswordToken = randomUUID()
      const userCanResetPasswordUntil = new Date(Date.now() + 3600000).toISOString() // 1 hour from signup time

      await connectDB(
        `UPDATE users
            SET shms_email = ?,
            shms_user_account_status = ?,
            shms_user_reset_token = ?,
            shms_user_reset_token_expires = ?
          WHERE shms_email = ?;`,
        [
          userEmail,
          'pending',
          userResetPasswordToken,
          userCanResetPasswordUntil,
          oldEmail
        ]
      )

      //send the user an email with a link to reset his/her password
      const emailData = {
        from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
        to: userEmail,
        subject: 'تأكيد البريد الالكتروني الجديد | شمس للخدمات الزراعية',
        msg: {
          title: `تأكيد البريد الالكتروني الجديد`,
          msg: `عزيزي ${fullname ?? 'المستخدم'}،
            <br /><br />
            تم تغيير البريد الاكتروني الخاص بك بنجاح، يرجى الضغط على تفعيل البريد الالكتروني في الزر أدناه لتفعيل تسجيل الدخول باستخدام البريد الاكتروني الجديد.

            <a href="${APP_URL}/auth/activate/${userResetPasswordToken}"
              class="cta__button"
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
        }
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
            message: `عفواً, لم يتم إرسال رسالة تأكيد تغيير كلمة المرور, يرجى المحاولة مرة أخرى, وإذا استمرت المشكلة يرجى التواصل مع الإدارة`,
            resetEmail: 0
          })
        )
      }

      return new Response(
        JSON.stringify({
          message: `تم إرسال بريد الكتروني لتأكيد البريد الالكتروني الجديد، الرجاء إتباع التعليمات في البريد الالكتروني المرسل لكم في البريد الالكتروني الجديد`,
          resetEmail: 1
        })
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        resetEmail: 0,
        message: `عفواً, حدث خطأ غير متوقع، لا يمكن تغيير البريد الالكتروني - يرجى التواصل مع الإدارة`
      }),
      { status: 500 }
    )
  }
}

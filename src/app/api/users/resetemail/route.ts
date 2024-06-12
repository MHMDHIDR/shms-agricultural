import { connectDB } from '@/api/utils/db'
import { randomUUID } from 'crypto'
import email from '@/libs/actions/email'
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
      const anHour = 3600000
      const userResetPasswordToken = randomUUID()
      const userCanResetPasswordUntil = new Date(Date.now() + anHour * 2)

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

      const buttonLink = APP_URL + `/auth/activate/${userResetPasswordToken}`

      // send the user an email with a link to reset his/her password
      const emailData = {
        from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
        to: userEmail,
        subject: 'تأكيد البريد الالكتروني الجديد | شمس للخدمات الزراعية',
        msg: {
          title: `تأكيد البريد الالكتروني الجديد`,
          msg: `عزيزي ${fullname ?? 'المستخدم'}،
            <br /><br />
            تم تغيير البريد الاكتروني الخاص بك بنجاح، يرجى الضغط على تفعيل البريد الالكتروني في الزر أدناه لتفعيل تسجيل الدخول باستخدام البريد الاكتروني الجديد.

            <strong>إذا لم تقم بعمل هذا الإجراء، فيرجى الاتصال بنا على الفور على البريد الإلكتروني التالي: ${ADMIN_EMAIL}</strong>

            شكراً لك.
            <br />
            <small>لا حاجة للرد على هذا البريد الإلكتروني.</small>`,
          buttonLink,
          buttonLabel: 'تفعيل البريد الالكتروني الجديد'
        }
      }

      // try to send the email
      try {
        const data = await email(emailData)
        if (data?.id) {
          return new Response(
            JSON.stringify({
              message: `تم إرسال بريد الكتروني لتأكيد البريد الالكتروني الجديد، الرجاء إتباع التعليمات في البريد الالكتروني المرسل لكم في البريد الالكتروني الجديد... جاري تسجيل الخروج`,
              resetEmail: 1
            })
          )
        } else {
          return new Response(
            JSON.stringify({
              resetEmail: 0,
              message: `عفواً, لم يتم إرسال رسالة تأكيد تغيير كلمة المرور, يرجى المحاولة مرة أخرى, وإذا استمرت المشكلة يرجى التواصل مع الإدارة`
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

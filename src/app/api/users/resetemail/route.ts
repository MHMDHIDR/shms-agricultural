import email from '@/libs/actions/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import client from '@/../prisma/prismadb'
import { ObjectId } from 'mongodb'
import { revalidatePath } from 'next/cache'

export async function PATCH(req: Request) {
  const body = await req.json()
  const { userEmail, oldEmail, fullname } = body

  try {
    // Check if the new email is already in use by an active user
    const user = await client.users.findFirst({
      where: {
        shms_email: userEmail,
        shms_user_is_deleted: false
      }
    })

    // If the user is trying to change their email to the same email
    if (user && user.shms_email === oldEmail) {
      return new Response(
        JSON.stringify({
          resetEmail: 0,
          message: `عفواً، البريد الالكتروني الجديد مطابق للبريد الالكتروني القديم، يرجى إستخدام بريد الكتروني آخر`
        }),
        { status: 400 }
      )
    }

    if (user) {
      return new Response(
        JSON.stringify({
          resetEmail: 0,
          message: `عفواً، البريد الالكتروني مستخدم من قبل، يرجى إستخدام بريد الكتروني آخر`
        }),
        { status: 400 }
      )
    } else {
      const oneHour = 3600000
      const userResetPasswordToken = new ObjectId().toHexString()
      const userCanResetPasswordUntil = new Date(Date.now() + oneHour * 2)

      await client.users.update({
        where: {
          shms_email: oldEmail,
          shms_user_is_deleted: false
        },
        data: {
          shms_email: userEmail,
          shms_user_account_status: 'pending',
          shms_user_reset_token: userResetPasswordToken,
          shms_user_reset_token_expires: userCanResetPasswordUntil
        }
      })

      const buttonLink = `${APP_URL}/auth/activate/${userResetPasswordToken}`

      // Send the user an email with a link to confirm their new email
      const emailData = {
        from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
        to: userEmail,
        subject: 'تأكيد البريد الالكتروني الجديد | شمس للخدمات الزراعية',
        msg: {
          title: `تأكيد البريد الالكتروني الجديد`,
          msg: `عزيزي ${fullname ?? 'المستخدم'},
            <br /><br />
            تم تغيير البريد الاكتروني الخاص بك بنجاح، يرجى الضغط على تفعيل البريد الالكتروني في الزر أدناه لتفعيل تسجيل الدخول باستخدام البريد الاكتروني الجديد.
            <br /><br />
            <strong>إذا لم تقم بعمل هذا الإجراء، فيرجى الاتصال بنا على الفور على البريد الإلكتروني التالي: ${ADMIN_EMAIL}</strong>
            <br /><br />
            شكراً لك.
            <br />
            <small>لا حاجة للرد على هذا البريد الإلكتروني.</small>`,
          buttonLink,
          buttonLabel: 'تفعيل البريد الالكتروني الجديد'
        }
      }

      // Try to send the email
      const data = await email(emailData)
      if (data?.id) {
        return new Response(
          JSON.stringify({
            message: `تم إرسال بريد الكتروني لتأكيد البريد الالكتروني الجديد، الرجاء إتباع التعليمات في البريد الالكتروني المرسل لكم في البريد الالكتروني الجديد... يرجى تسجيل الدخول بعد تأكيد البريد الالكتروني الجديد`,
            resetEmail: 1
          })
        )
      } else {
        return new Response(
          JSON.stringify({
            resetEmail: 0,
            message: `عفواً، لم يتم إرسال رسالة تأكيد تغيير كلمة المرور، يرجى المحاولة مرة أخرى، وإذا استمرت المشكلة يرجى التواصل مع الإدارة`
          })
        )
      }
    }
  } catch (error) {
    console.error(error)

    return new Response(
      JSON.stringify({
        resetEmail: 0,
        message: `عفواً، حدث خطأ غير متوقع، لا يمكن تغيير البريد الالكتروني - يرجى التواصل مع الإدارة`
      }),
      { status: 500 }
    )
  } finally {
    // Signing out from the frontend, and then revalidate the session (layout)
    revalidatePath('/', 'layout')
  }
}

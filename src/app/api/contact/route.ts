import email, { customEmail } from '@/app/api/utils/email'
import { ADMIN_EMAIL } from '@/data/constants'

export async function POST(req: Request) {
  const body = await req.json()
  const { emailOrPhone, address, message } = body

  if (!emailOrPhone || !address || !message) {
    return new Response(
      JSON.stringify({ message: 'يجب تعبئة جميع الحقول', mailSent: 0 }),
      { status: 400 }
    )
  }

  try {
    const emailData = {
      name: `رسالة جديدة ${emailOrPhone}`,
      subject: 'رسالة جديدة من شمس للخدمات الزراعية',
      from: emailOrPhone,
      to: ADMIN_EMAIL,
      msg: customEmail({
        title: `رسالة جديدة من شمس للخدمات الزراعية ${address}`,
        msg: `عزيزي ${ADMIN_EMAIL}،
        <br />
          <pre>
            ${message}
          </pre>
        <br /><br />
        شكراً لك.`
      })
    }

    const { accepted, rejected } = await email(emailData)

    if (accepted.length > 0) {
      return new Response(
        JSON.stringify({
          message: `تم إرسال رسالتك بنجاح، سيتم الرد في أقرب وقت ممكن!`,
          mailSent: 1
        })
      )
    } else if (rejected.length > 0) {
      return new Response(
        JSON.stringify({
          message: `عفواً! حدث خطأ أثناء إرسال رسالتك لنا!: ${rejected[0]}`,
          mailSent: 0
        })
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ message: `عفواً، حدث خطأ غير متوقع`, mailSent: 0 })
    )
  }
}

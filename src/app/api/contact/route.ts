import email from '@/lib/actions/email'
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
      name: emailOrPhone,
      subject: 'رسالة جديدة من شمس للخدمات الزراعية',
      from: emailOrPhone,
      to: 'mr.hamood277@gmail.com', //ADMIN_EMAIL,
      msg: {
        title: address,
        msg: `عزيزي ${ADMIN_EMAIL}،
        ${message}`
      }
    }

    const data = await email(emailData)

    if (data) {
      return new Response(
        JSON.stringify({
          message: `تم إرسال رسالتك بنجاح، سيتم الرد في أقرب وقت ممكن!`,
          mailSent: 1
        })
      )
    } else {
      return new Response(
        JSON.stringify({
          message: `عفواً! حدث خطأ أثناء إرسال رسالتك لنا!`,
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

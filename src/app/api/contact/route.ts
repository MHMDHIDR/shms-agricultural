import email, { customEmail } from '@/app/api/utils/email'
import { ADMIN_EMAIL } from '@/data/constants'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { emailOrPhone, address, message } = body

  const origin = req.headers.get('origin')

  if (!emailOrPhone || !address || !message) {
    return new Response(
      JSON.stringify({ message: 'يجب تعبئة جميع الحقول', mailSent: 0 }),
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      }
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
        }),
        {
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    } else if (rejected.length > 0) {
      return new Response(
        JSON.stringify({
          message: `عفواً! حدث خطأ أثناء إرسال رسالتك لنا!: ${rejected[0]}`,
          mailSent: 0
        }),
        {
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ message: `عفواً، حدث خطأ غير متوقع`, mailSent: 0 }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

import { connectDB } from '@/app/api/utils/db'
import email, { customEmail } from '@/app/api/utils/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import type { UserProps } from '@/types'
import { ResultSetHeader } from 'mysql2/promise'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest) {
  const origin = req.headers.get('origin')

  const body = await req.json()
  const { userId } = body

  if (!userId) throw new Error('Token ID is required')

  try {
    // Check if user exists
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_id = ?`, [userId])) as UserProps[]
    )[0]

    // If user does not exist
    if (!user) {
      return new Response(
        JSON.stringify({ userAdded: 0, message: 'عفواً لم يتم العثور على الحساب!' }),
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // If user exists but already activated
    if (user && new Date() >= new Date(user.shms_user_reset_token_expires!)) {
      return new Response(
        JSON.stringify({ userAdded: 0, message: 'انتهت صلاحية رابط تفعيل الحساب!' }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    } else if (
      user.shms_user_reset_token_expires === null &&
      (user.shms_user_account_status === 'active' ||
        user.shms_user_account_status === 'block')
    ) {
      return new Response(
        JSON.stringify({ userAdded: 0, message: 'الحساب مفعل سابقاً' }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    } else {
      // activate user
      const activateUser = (await connectDB(
        `UPDATE users
          SET shms_user_account_status = ?, 
            shms_user_reset_token_expires = NULL
            WHERE shms_id = ?`,
        ['active', userId]
      )) as ResultSetHeader

      const { affectedRows: isActivated } = activateUser as ResultSetHeader

      if (isActivated) {
        //send the user an email with a link to activate his/her account
        const buttonLink = APP_URL + `/auth/signin`

        const emailData = {
          from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
          to: user?.shms_email,
          subject: 'تم تفعيل حسابك بنجاح | شمس للخدمات الزراعية',
          msg: customEmail({
            title: 'مرحباً بك في شمس للخدمات الزراعية',
            msg: `
            <h1 style="font-weight:bold">مرحباً ${user?.shms_fullname},</h1>
            <p>
             شكراً لتسجيلك في شمس للخدمات الزراعي،
             تم تفعيل حسابك بنجاح، يمكنك الآن تسجيل الدخول إلى حسابك من خلال الرابط أدناه:
            </p>
            <br /><br />
            <small>إذا كنت تعتقد أن هذا البريد الالكتروني وصلك بالخطأ، أو أن هنالك مشكلة ما، يرجى تجاهل هذا البريد من فضلك!</small>`,
            buttonLink,
            buttonLabel: 'تسجيل الدخول'
          })
        }

        const { accepted, rejected } = await email(emailData)
        if (accepted.length > 0) {
          return new Response(
            JSON.stringify({
              userActivated: 1,
              message: `تم إرسال بريد الكتروني لتأكيد تفعيل حساب المستخدم، يمكنك تسجيل الدخول بنجاح 👍🏼`
            }),
            {
              status: 201,
              headers: {
                'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
                'Content-Type': 'application/json'
              }
            }
          )
        } else if (rejected.length > 0) {
          return new Response(
            JSON.stringify({
              userActivated: 0,
              message: `عفواً، لم يتم إرسال بريد الكتروني لتأكيد تفعيل حساب المستخدم!`
            }),
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
    }
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        userActivated: 0,
        message: `عفواً، لم يتم تفعيل حساب المستخدم بنجاح!`
      }),
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

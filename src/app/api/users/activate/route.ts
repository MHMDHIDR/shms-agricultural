import { connectDB } from '@/api/utils/db'
import email from '@/libs/actions/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import type { UserProps } from '@/types'

export async function PUT(req: Request) {
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
        { status: 404 }
      )
    }

    // If user exists but already activated
    if (
      user.shms_user_reset_token_expires === null &&
      (user.shms_user_account_status === 'active' ||
        user.shms_user_account_status === 'block')
    ) {
      return new Response(
        JSON.stringify({ userAdded: 0, message: 'الحساب مفعل سابقاً' }),
        { status: 400 }
      )
    } else if (
      user &&
      new Date() >= new Date(user.shms_user_reset_token_expires as number)
    ) {
      return new Response(
        JSON.stringify({ userAdded: 0, message: 'انتهت صلاحية رابط تفعيل الحساب!' }),
        { status: 400 }
      )
    } else {
      // activate user
      await connectDB(
        `UPDATE users
          SET shms_user_account_status = ?, 
            shms_user_reset_token_expires = NULL,
            shms_user_reset_token = NULL
            WHERE shms_user_reset_token = ?`,
        ['active', userId]
      )

      //send the user an email with a link to activate his/her account
      const buttonLink = APP_URL + `/auth/signin`

      const emailData = {
        from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
        to: user?.shms_email,
        subject: 'تم تفعيل حسابك بنجاح | شمس للخدمات الزراعية',
        msg: {
          title: 'مرحباً بك في شمس للخدمات الزراعية',
          msg: `
            <h1 style="font-weight:bold">مرحباً ${user?.shms_fullname},</h1>
            <p>
             شكراً لتسجيلك في شمس للخدمات الزراعي،
             تم تفعيل حسابك بنجاح، يمكنك الآن تسجيل الدخول إلى حسابك من خلال الرابط أدناه:
            </p>`,
          buttonLink,
          buttonLabel: 'تسجيل الدخول'
        }
      }

      const data = await email(emailData)

      if (data?.id) {
        return new Response(
          JSON.stringify({
            userActivated: 1,
            message: `تم إرسال بريد الكتروني لتأكيد تفعيل حساب المستخدم، يمكنك تسجيل الدخول بنجاح 👍🏼`
          }),
          { status: 201 }
        )
      } else {
        return new Response(
          JSON.stringify({
            userActivated: 0,
            message: `عفواً، لم يتم إرسال بريد الكتروني لتأكيد تفعيل حساب المستخدم!`
          }),
          { status: 500 }
        )
      }
    }
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        userActivated: 0,
        message: `عفواً، لم يتم تفعيل حساب المستخدم بنجاح!`
      }),
      { status: 500 }
    )
  }
}

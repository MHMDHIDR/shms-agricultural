import { connectDB } from '@/app/api/utils/db'
import type { UserProps } from '@/types'
import { ComparePasswords } from '../../utils/compare-password'

/**
 * an endpoint to check if user is authenticated or not
 * @param req The incoming request data coming from the client
 * @returns The response with the user data if the user is authenticated
 * Example: { isAuth: 1, type: 'admin' | 'user' }
 */
export async function POST(req: Request) {
  const body = await req.json()
  const { email } = body

  if (email === '') {
    return new Response(JSON.stringify({ isAuth: 0, message: 'Check is Auth Failed!' }), {
      status: 400
    })
  }

  // If user is found, check if his/her account is active or blocked
  try {
    // Check for user by using his/her email
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_email = ?`, [
        email
      ])) as UserProps[]
    )[0]

    if (!user) {
      return new Response(
        JSON.stringify({ isAuth: 0, message: 'لم يتم العثور على المستخدم' })
      )
    }

    if (user.shms_user_account_status === 'block') {
      return new Response(
        JSON.stringify({
          isAuth: 0,
          type: user.shms_user_account_type,
          message: 'حسابك محظور، يرجى التواصل مع الإدارة'
        }),
        { status: 403 }
      )
    } else if (user.shms_user_account_status === 'pending') {
      return new Response(
        JSON.stringify({
          isAuth: 0,
          type: user.shms_user_account_type,
          message:
            'حسابك غير مفعل بعد، يرجى تفعيل حسابك عن طريق الرابط المرسل إلى بريدك الإلكتروني'
        }),
        { status: 403 }
      )
    } else {
      return new Response(
        JSON.stringify({
          isAuth: 1,
          type: user.shms_user_account_type,
          message: 'تم التأكد من صحة البيانات'
        }),
        { status: 200 }
      )
    }
  } catch (error) {
    console.error(error)
    throw new Error('Error during authorization')
  }
}

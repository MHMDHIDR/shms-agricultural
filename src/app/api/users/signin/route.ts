import { connectDB } from '@/app/api/utils/db'
import type { UserProps } from '@/types'
import { ComparePasswords } from '../../utils/compare-password'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, phone, password, emailOrPhone } = body

  if (email === '' || phone === '') {
    return new Response(
      JSON.stringify({ userAdded: 0, message: 'Please Fill In  All The Fields' }),
      { status: 400 }
    )
  }

  // If user is found, check if his/her account is active or blocked
  try {
    // Check for user by using his/her email or Phoneephone number
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_email = ? OR shms_phone = ?`, [
        email ?? emailOrPhone,
        phone ?? emailOrPhone
      ])) as UserProps[]
    )[0]

    if (!user) {
      return new Response(
        JSON.stringify({ loggedIn: 0, message: 'لم يتم العثور على المستخدم' })
      )
    }

    if (user.shms_user_account_status === 'block') {
      return new Response(
        JSON.stringify({
          loggedIn: 0,
          message: 'حسابك محظور، يرجى التواصل مع الإدارة'
        }),
        { status: 403 }
      )
    } else if (user.shms_user_account_status === 'pending') {
      return new Response(
        JSON.stringify({
          loggedIn: 0,
          message:
            'حسابك غير مفعل بعد، يرجى تفعيل حسابك عن طريق الرابط المرسل إلى بريدك الإلكتروني'
        }),
        { status: 403 }
      )
    } else if (user && (await ComparePasswords(user.shms_password ?? '', password))) {
      return new Response(
        JSON.stringify({
          loggedIn: 1,
          fullname: user.shms_fullname,
          shms_email: user.shms_email,
          shms_phone: user.shms_phone,
          shms_doc: user.shms_doc,
          shms_user_account_type: user.shms_user_account_type,
          shms_user_stock_limit: user.shms_user_stock_limit,
          message: 'تم تسجيل الدخول بنجاح'
        })
      )
    } else {
      return new Response(
        JSON.stringify({
          loggedIn: 0,
          message: 'Invalid Email/Telephone Number Or Password'
        }),
        { status: 401 }
      )
    }
  } catch (error) {
    console.error(error)
    throw new Error('Error during authorization')
  }
}

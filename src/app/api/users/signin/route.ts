import client from '@/../prisma/prismadb'
import { ComparePasswords } from '@/api/utils/compare-password'
import type { Users } from '@prisma/client'

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
    const user = await client.users.findFirst({
      where: {
        OR: [{ shms_email: email ?? emailOrPhone }, { shms_phone: phone ?? emailOrPhone }]
      }
    })

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
          shms_fullname: user.shms_fullname,
          id: user.id,
          shms_email: user.shms_email,
          shms_phone: user.shms_phone,
          shms_doc: user.shms_doc,
          shms_user_account_type: user.shms_user_account_type,
          shms_user_stock_limit: user.shms_user_stock_limit,
          shms_user_withdrawable_balance: user.shms_user_withdrawable_balance,
          shms_user_total_balance: user.shms_user_total_balance,
          shms_user_stocks: user.shms_user_stocks,
          message: 'تم تسجيل الدخول بنجاح'
        } as Users)
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

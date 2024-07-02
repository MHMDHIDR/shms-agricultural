import client from '@/../prisma/prismadb'
import { ComparePasswords } from '@/api/utils/compare-password'
import type { Users } from '@prisma/client'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, phone, password, emailOrPhone } = body

  if (email === '' || phone === '') {
    return new Response(
      JSON.stringify({ userAdded: 0, message: 'الرجاء إدخال جميع الحقول!' }),
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
        JSON.stringify({ loggedIn: 0, message: 'لم يتم العثور على المستخدم' }),
        { status: 404 }
      )
    }

    // Compare password
    const isPasswordCorrect = await ComparePasswords(user.shms_password ?? '', password)

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
    } else if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ loggedIn: 0, message: 'كلمة المرور غير صحيحة' }),
        { status: 401 }
      )
    } else {
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
    }
  } catch (error) {
    console.error(error)
    throw new Error(
      `حدث خطأ ما: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    )
  }
}

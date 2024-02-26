import { connectDB } from '@/api/utils/db'
import email from '@/lib/actions/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import { randomUUID } from 'crypto'
import type { UserProps } from '@/types'

export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  const body = await req.json()
  const { withdrawAmount } = body

  if (!withdrawAmount) {
    return new Response(
      JSON.stringify({
        userWithdrawnBalance: 0,
        message: 'الرجاء إدخال الرصيد المطلوب سحبه!'
      }),
      { status: 400 }
    )
  }

  // Check if user exists
  const userExists = (
    (await connectDB(`SELECT * FROM users WHERE shms_id = ?`, [userId])) as UserProps[]
  )[0]

  if (!userExists) {
    return new Response(
      JSON.stringify({ userWithdrawnBalance: 0, message: 'المستخدم غير موجود!' }),
      { status: 404 }
    )
  }

  if (withdrawAmount > userExists.shms_user_withdrawable_balance) {
    return new Response(
      JSON.stringify({
        userWithdrawnBalance: 0,
        message: 'الرصيد المطلوب سحبه أكبر من الرصيد المتاح!'
      }),
      { status: 400 }
    )
  }

  try {
    const referenceCode = randomUUID()

    // create new user
    await connectDB(
      `INSERT INTO withdraw_actions (shms_withdraw_id, shms_withdraw_amount, shms_user_id) VALUES (?, ?, ?)`,
      [referenceCode, withdrawAmount, userId]
    )

    // Update user balance, subtract the withdraw amount and later on
    // if the admin rejects the withdraw, we will add the amount back to the user balance
    const currentBalance = userExists.shms_user_withdrawable_balance
    const userNewBalance = currentBalance - withdrawAmount
    await connectDB(
      `UPDATE users SET shms_user_withdrawable_balance = ? WHERE shms_id = ?`,
      [userNewBalance, userExists.shms_id]
    )

    //send the user an email with a link to activate his/her account
    const buttonLink = APP_URL + `/profile/investments/withdraw`

    const emailData = {
      from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
      to: userExists.shms_email,
      subject: 'سحب رصيد | شمس للخدمات الزراعية',
      msg: {
        title: 'طلب سحب رصيد من حسابك في شمس للخدمات الزراعية',
        msg: `
          مرحباً، ${userExists.shms_fullname}!

          شكراً لإرسال طلب سحب الرصيد من شمس.

          مبلغ السحب: ${withdrawAmount} ريال قطري فقط.

          بمجرد مراجعة طلبك من قبلنا، سيتم إشعارك بحالة الطلب.`,
        buttonLink,
        buttonLabel: 'مراجعة الطلب'
      }
    }

    const data = await email(emailData)
    if (data?.id) {
      return new Response(
        JSON.stringify({
          userWithdrawnBalance: 1,
          message: `تم إرسال طلب السحب وسيتم إشعارك قريباً بحالة الطلب 👍🏼`
        }),
        { status: 201 }
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        userWithdrawnBalance: 0,
        message: `عفواً! لم يتم إرسال طلب السحب، حدث خطأ ما! `
      }),
      { status: 500 }
    )
  }
}

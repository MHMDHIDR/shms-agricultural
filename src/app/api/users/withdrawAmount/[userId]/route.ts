import email from '@/libs/actions/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import { ObjectId } from 'mongodb'
import client from '@/../prisma/prismadb'
import type { Users } from '@prisma/client'

export async function POST(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  const body = await req.json()
  let { withdrawAmount }: { withdrawAmount: Users['shms_user_withdrawable_balance'] } =
    body

  withdrawAmount = parseInt(String(withdrawAmount))

  if (!withdrawAmount) {
    return new Response(
      JSON.stringify({
        userWithdrawnBalance: 0,
        message: 'الرجاء إدخال الرصيد المطلوب سحبه!'
      }),
      { status: 400 }
    )
  }

  try {
    // Check if user exists and is not deleted
    const userExists = await client.users.findFirst({
      where: { id: userId, shms_user_is_deleted: false }
    })

    // If user does not exist or is deleted
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

    const referenceCode = new ObjectId().toHexString()

    // Create withdrawal action record
    await client.withdraw_actions.create({
      data: {
        id: referenceCode,
        shms_withdraw_amount: withdrawAmount,
        shms_user_id: userId
      }
    })

    // Update user balance, subtract the withdraw amount
    const currentBalance = userExists.shms_user_withdrawable_balance
    const userNewBalance = currentBalance - withdrawAmount

    await client.users.update({
      where: { id: userId },
      data: { shms_user_withdrawable_balance: userNewBalance }
    })

    // Send email notification to the user
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

    const emailResponse = await email(emailData)

    if (emailResponse?.id) {
      return new Response(
        JSON.stringify({
          userWithdrawnBalance: 1,
          message: `تم إرسال طلب السحب وسيتم إشعارك قريباً بحالة الطلب 👍🏼`
        }),
        { status: 201 }
      )
    } else {
      return new Response(
        JSON.stringify({
          userWithdrawnBalance: 0,
          message: `عفواً! لم يتم إرسال طلب السحب، حدث خطأ ما!`
        }),
        { status: 500 }
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        userWithdrawnBalance: 0,
        message: `عفواً! لم يتم إرسال طلب السحب، حدث خطأ ما! ${error}`
      }),
      { status: 500 }
    )
  }
}

// /withdrawActions/update/[operationId]
import { connectDB } from '@/api/utils/db'
import email from '@/lib/actions/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import type { UserProps, withdrawActionsProps } from '@/types'
import { arabicDate } from '@/lib/utils'

export async function PATCH(
  req: Request,
  { params: { operationId } }: { params: { operationId: string } }
) {
  if (!operationId) throw new Error('User ID is required')

  const body = await req.json()
  const {
    status: withdraw_withdraw_status,
    userId: shms_user_id
  }: {
    status: withdrawActionsProps['withdraw_withdraw_status']
    userId: withdrawActionsProps['shms_user_id']
  } = body

  if (!withdraw_withdraw_status) {
    return new Response(
      JSON.stringify({
        withdrawUpdated: 0,
        message: 'الرجاء إدخال الرصيد المطلوب سحبه!'
      }),
      { status: 400 }
    )
  }

  // Check if user exists
  const userExists = (
    (await connectDB(`SELECT * FROM users WHERE shms_id = ?`, [
      shms_user_id
    ])) as UserProps[]
  )[0]
  // Check if operation exists
  const operationExists = (
    (await connectDB(`SELECT * FROM withdraw_actions WHERE shms_withdraw_id = ?`, [
      operationId
    ])) as withdrawActionsProps[]
  )[0]

  if (!userExists || !operationExists) {
    return new Response(
      JSON.stringify({
        withdrawUpdated: 0,
        message: `عفواً! لم يتم إيجاد المستخدم أو العملية المطلوبة`
      }),
      { status: 404 }
    )
  }

  try {
    // create new user
    withdraw_withdraw_status === 'deleted'
      ? await connectDB(`DELETE FROM withdraw_actions SET WHERE shms_withdraw_id = ?`, [
          operationId
        ])
      : await connectDB(
          `UPDATE withdraw_actions SET withdraw_withdraw_status = ? WHERE shms_withdraw_id = ?`,
          [withdraw_withdraw_status, operationId]
        )

    //send the user an email with a link to activate his/her account
    const buttonLink = APP_URL + `/profile/investments/withdraw`

    const emailData = {
      from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
      to: userExists.shms_email,
      subject: `${
        withdraw_withdraw_status === 'completed'
          ? 'تم الموافقة على'
          : withdraw_withdraw_status === 'rejected'
          ? 'تم رفض'
          : 'تم تحديث'
      } طلب ${
        operationExists?.shms_action_type === 'withdraw' ? 'سحب' : 'إيداع'
      } رصيد في حسابك رصيد | شمس للخدمات الزراعية`,
      msg: {
        title: `${
          withdraw_withdraw_status === 'completed'
            ? 'تم الموافقة على'
            : withdraw_withdraw_status === 'rejected'
            ? 'تم رفــض'
            : 'تم تحديث'
        } طلب ${operationExists?.shms_action_type === 'withdraw' ? 'سحب' : 'إيداع'} رصيد`,
        msg: `
          مرحباً، ${userExists.shms_fullname}!

          نود إعلامك بأن طلب ${
            operationExists?.shms_action_type === 'withdraw' ? 'السحب' : 'الإيداع'
          } الذي قمت به تم في تاريخ ${
          arabicDate(operationExists?.shms_created_at) ?? 'غير معروف'
        } بحالة ${
          withdraw_withdraw_status === 'completed'
            ? 'تم الموافقة'
            : withdraw_withdraw_status === 'rejected'
            ? 'تم الرفض'
            : 'تم تحديث'
        }.

          مبلغ السحب: ${operationExists?.shms_withdraw_amount} ريال قطري فقط.`,
        buttonLink,
        buttonLabel: 'مراجعة الطلب'
      }
    }

    const data = await email(emailData)
    if (data?.id) {
      return new Response(
        JSON.stringify({
          withdrawUpdated: 1,
          message: `${
            withdraw_withdraw_status === 'completed'
              ? 'تم الموافقة على'
              : withdraw_withdraw_status === 'rejected'
              ? 'تم رفض'
              : 'تم تحديث'
          } الطلب بنجاح 👍🏼`
        }),
        { status: 201 }
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        withdrawUpdated: 0,
        message: `عفواً! لم يتم ${
          withdraw_withdraw_status === 'completed'
            ? 'تم الموافقة'
            : withdraw_withdraw_status === 'rejected'
            ? 'تم الرفض'
            : 'تم تحديث'
        }، حدث خطأ ما! `
      }),
      { status: 500 }
    )
  }
}

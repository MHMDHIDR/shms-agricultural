import { connectDB } from '@/api/utils/db'
import email from '@/lib/actions/email'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import type { UserProps, accountingOperationsProps } from '@/types'
import { arabicDate } from '@/lib/utils'

export async function PATCH(
  req: Request,
  { params: { operationId } }: { params: { operationId: string } }
) {
  if (!operationId) throw new Error('Operation ID is required')

  const body = await req.json()
  const {
    status: accounting_operation_status,
    userId: shms_user_id
  }: {
    status: accountingOperationsProps['accounting_operation_status']
    userId: accountingOperationsProps['shms_user_id']
  } = body

  if (!accounting_operation_status) {
    return new Response(
      JSON.stringify({
        withdrawUpdated: 0,
        message: 'Please provide the required balance to withdraw!'
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
    ])) as accountingOperationsProps[]
  )[0]

  if (!userExists || !operationExists) {
    return new Response(
      JSON.stringify({
        withdrawUpdated: 0,
        message: 'User or operation not found!'
      }),
      { status: 404 }
    )
  }

  try {
    if (accounting_operation_status === 'deleted') {
      await connectDB(`DELETE FROM withdraw_actions WHERE shms_withdraw_id = ?`, [
        operationId
      ])
    } else {
      await connectDB(
        `UPDATE withdraw_actions SET accounting_operation_status = ? WHERE shms_withdraw_id = ?`,
        [accounting_operation_status, operationId]
      )

      const currentBalance = userExists.shms_user_withdrawable_balance

      if (
        accounting_operation_status === 'rejected' &&
        (operationExists.accounting_operation_status === 'completed' ||
          operationExists.accounting_operation_status === 'pending')
      ) {
        const userNewBalance = currentBalance + operationExists.shms_withdraw_amount
        await connectDB(
          `UPDATE users SET shms_user_withdrawable_balance = ? WHERE shms_id = ?`,
          [userNewBalance, shms_user_id]
        )
      } else if (
        accounting_operation_status === 'completed' &&
        operationExists.accounting_operation_status === 'rejected'
      ) {
        const userNewBalance = currentBalance - operationExists.shms_withdraw_amount
        await connectDB(
          `UPDATE users SET shms_user_withdrawable_balance = ? WHERE shms_id = ?`,
          [userNewBalance, shms_user_id]
        )
      }

      const buttonLink = APP_URL + `/profile/investments/withdraw`

      const emailData = {
        from: `SHMS Agriculture <${ADMIN_EMAIL}>`,
        to: userExists.shms_email,
        subject: `${
          accounting_operation_status === 'completed'
            ? 'Approved'
            : accounting_operation_status === 'rejected'
            ? 'Rejected'
            : 'Deleted'
        } request for ${
          operationExists?.shms_action_type === 'withdraw' ? 'withdrawal' : 'deposit'
        } in your SHMS account`,
        msg: {
          title: `${
            accounting_operation_status === 'completed'
              ? 'Approved'
              : accounting_operation_status === 'rejected'
              ? 'Rejected'
              : 'Deleted'
          } request for ${
            operationExists?.shms_action_type === 'withdraw' ? 'withdrawal' : 'deposit'
          }`,
          msg: `Hi ${userExists.shms_fullname}!

          We would like to inform you that your ${
            operationExists?.shms_action_type === 'withdraw' ? 'withdrawal' : 'deposit'
          } request on ${
            arabicDate(operationExists?.shms_created_at) ?? 'unknown'
          } has been ${
            accounting_operation_status === 'completed'
              ? 'approved'
              : accounting_operation_status === 'rejected'
              ? 'rejected'
              : 'deleted'
          }.

          Amount: ${operationExists?.shms_withdraw_amount} QAR only.`,
          buttonLink,
          buttonLabel: 'Review Request'
        }
      }

      const data = await email(emailData)
      if (data?.id) {
        return new Response(
          JSON.stringify({
            withdrawUpdated: 1,
            message: `${
              accounting_operation_status === 'completed'
                ? 'Approved'
                : accounting_operation_status === 'rejected'
                ? 'Rejected'
                : 'Updated'
            } successfully 👍🏼`
          }),
          { status: 201 }
        )
      }
    }
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        withdrawUpdated: 0,
        message: `عفواً! لم يتم ${
          accounting_operation_status === 'completed'
            ? 'تم الموافقة'
            : accounting_operation_status === 'rejected'
            ? 'تم الرفض'
            : 'تم تحديث'
        }، حدث خطأ ما! `
      }),
      { status: 500 }
    )
  }
}

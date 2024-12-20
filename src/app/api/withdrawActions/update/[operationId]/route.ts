import email from '@/libs/actions/email'
import client from '@/../prisma/prismadb'
import { ADMIN_EMAIL, APP_URL } from '@/data/constants'
import { arabicDate } from '@/libs/utils'
import type { accountingOperationsProps } from '@/types'

export async function PATCH(
  req: Request,
  { params: { operationId } }: { params: { operationId: string } }
) {
  if (!operationId) throw new Error('User ID is required')

  const body = await req.json()
  const {
    status: accounting_operation_status,
    userId
  }: {
    status: accountingOperationsProps['accounting_operation_status']
    userId: accountingOperationsProps['shms_user_id']
  } = body

  if (!accounting_operation_status) {
    return new Response(
      JSON.stringify({
        withdrawUpdated: 0,
        message: 'الرجاء إدخال الرصيد المطلوب سحبه!'
      }),
      { status: 400 }
    )
  }

  // Check if user exists
  const userExists = await client.users.findUnique({ where: { id: userId } })

  // Check if operation exists
  const operationExists = await client.withdraw_actions.findUnique({
    where: { id: operationId }
  })

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
    // update the operation status
    accounting_operation_status === 'deleted'
      ? await client.withdraw_actions.delete({
          where: { id: operationId }
        })
      : await client.withdraw_actions.update({
          where: { id: operationId },
          data: { accounting_operation_status }
        })

    const currentBalance = userExists.shms_user_credits
    let userNewBalance = 0

    if (
      operationExists.accounting_operation_status === 'pending' &&
      accounting_operation_status === 'completed'
    ) {
      userNewBalance = currentBalance
    } else if (
      operationExists.accounting_operation_status === 'completed' &&
      accounting_operation_status === 'rejected'
    ) {
      userNewBalance = currentBalance + operationExists.shms_withdraw_amount
    } else if (
      operationExists.accounting_operation_status === 'rejected' &&
      accounting_operation_status === 'completed'
    ) {
      userNewBalance = currentBalance - operationExists.shms_withdraw_amount
    } else if (
      operationExists.accounting_operation_status === 'rejected' &&
      accounting_operation_status === 'deleted'
    ) {
      userNewBalance = currentBalance
    } else if (
      operationExists.accounting_operation_status === 'completed' &&
      accounting_operation_status === 'deleted'
    ) {
      userNewBalance = currentBalance + operationExists.shms_withdraw_amount
    }

    await client.users.update({
      where: { id: userExists.id },
      data: { shms_user_credits: userNewBalance }
    })

    //send the user an email with a link to activate his/her account
    const buttonLink = APP_URL + `/profile/investments/withdraw`
    const emailData = {
      from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
      to: userExists.shms_email,
      subject: `${
        accounting_operation_status === 'completed'
          ? 'تم الموافقة على'
          : accounting_operation_status === 'rejected'
          ? 'تم رفض'
          : 'تم حذف'
      } طلب ${
        operationExists?.shms_action_type === 'withdraw' ? 'سحب' : 'إيداع'
      } رصيد في حسابك رصيد | شمس للخدمات الزراعية`,
      msg: {
        title: `${
          accounting_operation_status === 'completed'
            ? 'تم الموافقة على'
            : accounting_operation_status === 'rejected'
            ? 'تم رفــض'
            : 'تم حذف'
        } طلب ${operationExists?.shms_action_type === 'withdraw' ? 'سحب' : 'إيداع'} رصيد`,
        msg: `
          مرحباً، ${userExists.shms_fullname}!

          نود إعلامك بأن طلب ${
            operationExists?.shms_action_type === 'withdraw' ? 'السحب' : 'الإيداع'
          } الذي قمت به تم في تاريخ ${
          arabicDate(operationExists?.shms_created_at) ?? 'غير معروف'
        } بحالة ${
          accounting_operation_status === 'completed'
            ? 'تم الموافقة'
            : accounting_operation_status === 'rejected'
            ? 'تم الرفض'
            : 'تم الحذف'
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
            accounting_operation_status === 'completed'
              ? 'تم الموافقة على'
              : accounting_operation_status === 'rejected'
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

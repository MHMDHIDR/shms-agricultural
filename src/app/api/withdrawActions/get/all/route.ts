import client from '@/../prisma/prismadb'

export const revalidate = 0

export async function GET() {
  try {
    // Using Prisma to retrieve withdraw actions with associated user details
    const withdrawActions = await client.withdraw_actions.findMany({
      select: {
        id: true,
        shms_created_at: true,
        shms_withdraw_amount: true,
        shms_action_type: true,
        accounting_operation_status: true,
        user: {
          select: {
            id: true,
            shms_fullname: true,
            shms_phone: true,
            shms_email: true,
            shms_address: true
          }
        }
      }
    })

    // Map the result to match the structure of the original SQL query
    const result = withdrawActions.map(action => ({
      shms_withdraw_id: action.id,
      shms_fullname: action.user.shms_fullname,
      shms_user_id: action.user.id,
      shms_withdraw_amount: action.shms_withdraw_amount,
      shms_created_at: action.shms_created_at,
      accounting_operation_status: action.accounting_operation_status,
      shms_action_type: action.shms_action_type,
      shms_phone: action.user.shms_phone,
      shms_email: action.user.shms_email,
      shms_address: action.user.shms_address
    }))

    // Return the response with the retrieved data
    return new Response(JSON.stringify(result))
  } catch (error) {
    // Handle any errors that occur during database query execution
    console.error('Error fetching withdraw actions:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

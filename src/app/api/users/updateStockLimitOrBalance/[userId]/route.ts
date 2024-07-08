import client from '@/../prisma/prismadb'

export async function PATCH(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  const body = await req.json()
  const { newValue, type } = body

  try {
    // Check if user exists and is not deleted
    const user = await client.users.findFirst({
      where: { id: userId, shms_user_is_deleted: false }
    })

    // If user does not exist or is deleted
    if (!user) {
      return new Response(
        JSON.stringify({ userUpdated: 0, message: 'عفواً لم يتم العثور على الحساب!' }),
        { status: 404 }
      )
    }

    let updateField = ''

    // Determine which field to update based on 'type' using switch statement
    switch (type) {
      case 'stockLimit':
        updateField = 'shms_user_stock_limit'
        break
      case 'totalBalance':
        updateField = 'shms_user_total_balance'
        break
      case 'withdrawableBalance':
        updateField = 'shms_user_withdrawable_balance'
        break
      default:
        return new Response(
          JSON.stringify({
            userUpdated: 0,
            message: 'Invalid update type provided. Please provide a valid type.'
          }),
          { status: 400 }
        )
    }

    // Perform the update operation
    const userUpdated = await client.users.update({
      where: { id: userId },
      data: {
        [updateField]: newValue
      }
    })

    // Check if user was updated successfully
    if (userUpdated) {
      return new Response(
        JSON.stringify({ userUpdated: 1, message: `تم تحديث حساب المستخدم بنجاح!` }),
        { status: 200 }
      )
    } else {
      return new Response(
        JSON.stringify({
          userUpdated: 0,
          message: `عفواً، لم يتم تحديث حساب المستخدم بنجاح!`
        }),
        { status: 400 }
      )
    }
  } catch (error) {
    console.error(error)

    return new Response(
      JSON.stringify({
        userUpdated: 0,
        message: `عفواً، حدثت مشكلة غير متوقعة، حاول مرة أخرى لاحقاً! ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`
      }),
      { status: 500 }
    )
  }
}

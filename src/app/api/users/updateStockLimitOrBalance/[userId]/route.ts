import client from '@/../prisma/prismadb'

export async function PATCH(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  const body = await req.json()
  const { newValue, type } = body

  try {
    // Check if user exists
    const user = await client.users.findUnique({ where: { id: userId } })

    // If user does not exist
    if (!user) {
      return new Response(
        JSON.stringify({ userUpdated: 0, message: 'عفواً لم يتم العثور على الحساب!' }),
        { status: 404 }
      )
    }

    const userUpdated = await client.users.update({
      where: { id: userId },
      data: {
        [type === 'stockLimit'
          ? 'shms_user_stock_limit'
          : type === 'totalBalance'
          ? 'shms_user_total_balance'
          : 'shms_user_withdrawable_balance']: newValue
      }
    })

    if (userUpdated) {
      return new Response(
        JSON.stringify({ userUpdated: 1, message: `تم تحديث حساب المستخدم بنجاح!` }),
        { status: 200 }
      )
    }

    return new Response(
      JSON.stringify({
        userUpdated,
        message: `عفواً، لم يتم تحديث حساب المستخدم بنجاح!`
      }),
      { status: 400 }
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        userUpdated: 0,
        message: `عفواً، حدثت مشكلة غير متوقعة، حاول مرة أخرى لاحقاً!`
      }),
      { status: 500 }
    )
  }
}

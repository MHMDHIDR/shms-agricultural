import client from '@/../prisma/prismadb'

export async function DELETE(
  _request: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  try {
    // Check if user exists
    const user = await client.users.findUnique({
      where: { id: userId }
    })

    // If user does not exist
    if (!user) {
      return new Response(
        JSON.stringify({ userDeleted: 0, message: 'عفواً لم يتم العثور على الحساب!' }),
        { status: 404 }
      )
    }

    // Get the user's stocks
    const userStocks = user.shms_user_stocks

    if (userStocks && userStocks.length > 0) {
      // Update projects to remove user stocks
      for (const stock of userStocks) {
        await client.projects.updateMany({
          where: { id: stock.id },
          data: {
            // Return stocks to the project
            shms_project_available_stocks: { increment: stock.stocks }
          }
        })
      }
    }

    // Delete the user // instead of .delete({ where: { id: userId } }) set shms_user_is_deleted in Users schema to true
    const userDeleted = await client.users.update({
      where: { id: userId },
      data: { shms_user_is_deleted: true }
    })

    if (userDeleted) {
      return new Response(
        JSON.stringify({ userDeleted: 1, message: `تم حذف حساب المستخدم بنجاح!` }),
        { status: 200 }
      )
    }

    return new Response(
      JSON.stringify({
        userDeleted: 0,
        message: `عفواً، لم يتم حذف حساب المستخدم بنجاح!`
      }),
      { status: 400 }
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        userDeleted: 0,
        message: `عفواً، حدثت مشكلة غير متوقعة، حاول مرة أخرى لاحقاً!`
      }),
      { status: 500 }
    )
  }
}

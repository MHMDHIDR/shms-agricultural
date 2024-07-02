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

    // activate user
    const userDeleted = await client.users.delete({
      where: { id: userId }
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

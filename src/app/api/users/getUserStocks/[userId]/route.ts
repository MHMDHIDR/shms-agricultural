import client from '@/../prisma/prismadb'

export async function GET(
  _req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  // If user is found, check if his/her account is active or blocked
  try {
    // Check for user by using their ID and ensuring they are not deleted
    const user = await client.users.findFirst({
      where: {
        id: userId,
        shms_user_is_deleted: false
      }
    })

    if (!user) {
      return new Response(JSON.stringify({ message: 'لم يتم العثور على المستخدم' }), {
        status: 404
      })
    }

    return new Response(
      JSON.stringify({
        totalAmount: user.shms_user_total_balance,
        withdrawableAmount: user.shms_user_withdrawable_balance,
        shms_user_stocks: user.shms_user_stock_limit
      })
    )
  } catch (error) {
    console.error(error)
    throw new Error('Error during authorization')
  }
}

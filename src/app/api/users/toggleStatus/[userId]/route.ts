import client from '@/../prisma/prismadb'
import type { UserStatus } from '@prisma/client'

export async function PATCH(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  const body = await req.json()
  const { status }: { status: UserStatus } = body

  if (!['active', 'pending', 'block'].includes(status)) {
    return new Response(
      JSON.stringify({
        userUpdated: 0,
        message: 'Invalid status provided. Please provide "active" or "inactive".'
      }),
      { status: 400 }
    )
  }

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

    // Update user status
    const updatedUser = await client.users.update({
      where: { id: userId },
      data: {
        shms_user_account_status: status,
        ...(status === 'active' && { shms_user_reset_token_expires: null })
      }
    })

    if (updatedUser) {
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

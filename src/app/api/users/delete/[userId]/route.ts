import { connectDB } from '@/app/api/utils/db'
import { ResultSetHeader } from 'mysql2/promise'
import type { UserProps } from '@/types'

export async function DELETE(
  _req: Request,
  { params: { userId: userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  try {
    // Check if user exists
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_user_reset_token = ?`, [
        userId
      ])) as UserProps[]
    )[0]

    // If user does not exist
    if (!user) {
      return new Response(
        JSON.stringify({ userDeleted: 0, message: 'عفواً لم يتم العثور على الحساب!' }),
        { status: 404 }
      )
    }

    // activate user
    const deleteUser = (await connectDB(`DELETE FROM users WHERE shms_id = ?`, [
      userId
    ])) as ResultSetHeader

    const { affectedRows: userDeleted } = deleteUser as ResultSetHeader

    if (userDeleted) {
      return new Response(
        JSON.stringify({ userDeleted, message: `تم حذف حساب المستخدم بنجاح!` }),
        { status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ userDeleted, message: `عفواً، لم يتم حذف حساب المستخدم بنجاح!` }),
      { status: 400 }
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        userDeleted: 0,
        message: `عفواً، لم يتم حذف حساب المستخدم بنجاح!`
      }),
      { status: 500 }
    )
  }
}

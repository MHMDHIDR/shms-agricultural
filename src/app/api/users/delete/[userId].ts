import { connectDB } from '@/app/api/utils/db'
import { ResultSetHeader } from 'mysql2/promise'
import type { UserProps } from '@/types'

export async function DELETE(req: Request) {
  const body = await req.json()
  const { userId } = body.query

  if (!userId) throw new Error('User ID is required')

  try {
    // Check if user exists
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_id = ?`, [userId])) as UserProps[]
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
    return new Response(
      JSON.stringify({
        userDeleted,
        message: `عفواً، لم يتم حذف حساب المستخدم بنجاح!`
      }),
      { status: 500 }
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

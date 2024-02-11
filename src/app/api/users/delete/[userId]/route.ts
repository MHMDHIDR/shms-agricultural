import { connectDB } from '@/app/api/utils/db'
import type { UserProps } from '@/types'
import { ResultSetHeader } from 'mysql2/promise'
import { NextRequest } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  const origin = req.headers.get('origin')

  try {
    // Check if user exists
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_id = ?`, [userId])) as UserProps[]
    )[0]

    // If user does not exist
    if (!user) {
      return new Response(
        JSON.stringify({ userDeleted: 0, message: 'عفواً لم يتم العثور على الحساب!' }),
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
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
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    }

    return new Response(
      JSON.stringify({ userDeleted, message: `عفواً، لم يتم حذف حساب المستخدم بنجاح!` }),
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        userDeleted: 0,
        message: `عفواً، حدثت مشكلة غير متوقعة، حاول مرة أخرى لاحقاً!`
      }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

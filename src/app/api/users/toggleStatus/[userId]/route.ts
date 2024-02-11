import { connectDB } from '@/app/api/utils/db'
import type { UserProps } from '@/types'
import { ResultSetHeader } from 'mysql2/promise'
import { NextRequest } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  const origin = req.headers.get('origin')

  const body = await req.json()
  const { status } = body

  try {
    // Check if user exists
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_id = ?`, [userId])) as UserProps[]
    )[0]

    // If user does not exist
    if (!user) {
      return new Response(
        JSON.stringify({ userUpdated: 0, message: 'عفواً لم يتم العثور على الحساب!' }),
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const updateUser = (await connectDB(
      `UPDATE users
          SET shms_user_account_status = ?
            ${status === 'active' ? ' ,shms_user_reset_token_expires = NULL' : ''}
            WHERE shms_id = ?`,
      ['active', userId]
    )) as ResultSetHeader

    const { affectedRows: userUpdated } = updateUser as ResultSetHeader

    if (userUpdated) {
      return new Response(
        JSON.stringify({ userUpdated, message: `تم تحديث حساب المستخدم بنجاح!` }),
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
      JSON.stringify({
        userUpdated,
        message: `عفواً، لم يتم تحديث حساب المستخدم بنجاح!`
      }),
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
        userUpdated: 0,
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

import { connectDB } from '@/app/api/utils/db'
import type { UserProps } from '@/types'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  const origin = req.headers.get('origin')

  // If user is found, check if his/her account is active or blocked
  try {
    // Check for user by using his/her email or Phoneephone number
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_id = ?`, [userId])) as UserProps[]
    )[0]

    if (!user) {
      return new Response(JSON.stringify({ message: 'لم يتم العثور على المستخدم' }), {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      })
    }

    return new Response(JSON.stringify({ shms_user_stocks: user.shms_user_stocks }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error(error)
    throw new Error('Error during authorization')
  }
}

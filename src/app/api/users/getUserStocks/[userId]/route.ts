import { connectDB } from '@/api/utils/db'
import type { UserProps } from '@/types'

export async function GET(
  _req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  // If user is found, check if his/her account is active or blocked
  try {
    // Check for user by using his/her email or Phoneephone number
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_id = ?`, [userId])) as UserProps[]
    )[0]

    if (!user) {
      return new Response(JSON.stringify({ message: 'لم يتم العثور على المستخدم' }), {
        status: 404
      })
    }

    return new Response(
      JSON.stringify({
        totalAmount: user.shms_user_total_balance,
        shms_user_stocks: user.shms_user_stocks
      })
    )
  } catch (error) {
    console.error(error)
    throw new Error('Error during authorization')
  }
}

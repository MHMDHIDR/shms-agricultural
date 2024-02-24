//withdrawActions/get/[userId]/route.ts
import { connectDB } from '@/api/utils/db'
import { NextRequest } from 'next/server'

export const revalidate = 10
export async function GET(request: NextRequest) {
  // get everything after /get/ in the URL
  const userId = request.nextUrl.pathname.split('/get/')[1]
  if (!userId) throw new Error('User ID is required')

  // look for user withdraw_actions  FROM withdraw_actions table
  const withdraw_actions = await connectDB(
    `SELECT * FROM withdraw_actions WHERE shms_user_id = ?`,
    [userId]
  )

  return new Response(JSON.stringify(withdraw_actions))
}

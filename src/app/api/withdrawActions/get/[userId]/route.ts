import client from '@/../prisma/prismadb'
import { NextRequest } from 'next/server'

export const revalidate = 0
export async function GET(request: NextRequest) {
  // get everything after /get/ in the URL
  const userId = request.nextUrl.pathname.split('/get/')[1]
  if (!userId) throw new Error('User ID is required')

  // look for user withdraw_actions  FROM withdraw_actions table
  const withdraw_actions = await client.withdraw_actions.findMany({
    where: { shms_user_id: userId }
  })

  return new Response(JSON.stringify(withdraw_actions))
}

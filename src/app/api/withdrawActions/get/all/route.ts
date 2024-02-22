//withdrawActions/get/[userId]/route.ts
import { connectDB } from '@/api/utils/db'

export async function GET() {
  // look for user withdraw_actions  FROM withdraw_actions table
  const withdraw_actions = await connectDB(`SELECT * FROM withdraw_actions`)

  return new Response(JSON.stringify(withdraw_actions))
}

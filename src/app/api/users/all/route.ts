import { connectDB } from '@/app/api/utils/db'

export async function GET() {
  const users = await connectDB(`SELECT * FROM users`)

  return new Response(JSON.stringify(users))
}

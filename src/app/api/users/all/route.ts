import { connectDB } from '@/api/utils/db'
import { type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const role = searchParams.get('role')

  // look for user  FROM users WHERE shms_user_stocks is not null
  const users =
    role === 'investor'
      ? await connectDB(`SELECT * FROM users WHERE shms_user_stocks is not null`)
      : await connectDB(`SELECT * FROM users`)

  return new Response(JSON.stringify(users))
}

import { connectDB } from '@/app/api/utils/db'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin')
  const searchParams = req.nextUrl.searchParams
  const role = searchParams.get('role')

  // look for user  FROM users WHERE shms_user_stocks is not null
  const users =
    role === 'investor'
      ? await connectDB(`SELECT * FROM users WHERE shms_user_stocks is not null`)
      : await connectDB(`SELECT * FROM users`)

  return new NextResponse(JSON.stringify(users), {
    headers: {
      'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
      'Content-Type': 'application/json'
    }
  })
}

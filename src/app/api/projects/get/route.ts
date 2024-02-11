import { connectDB } from '@/app/api/utils/db'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')

  const projects = await connectDB(`SELECT * FROM projects`)

  return new Response(JSON.stringify(projects), {
    headers: {
      'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
      'Content-Type': 'application/json'
    }
  })
}

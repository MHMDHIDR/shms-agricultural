import { connectDB } from '@/api/utils/db'

export async function GET() {
  const projects = await connectDB(`SELECT * FROM projects`)

  return new Response(JSON.stringify(projects))
}

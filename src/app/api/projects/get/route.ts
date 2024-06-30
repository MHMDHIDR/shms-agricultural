import client from '@/../prisma/prismadb'

export const revalidate = 0
export async function GET() {
  const projects = await client.projects.findMany()

  return projects.length === 0
    ? new Response(JSON.stringify([null]), { status: 200 })
    : new Response(JSON.stringify(projects), { status: 200 })
}

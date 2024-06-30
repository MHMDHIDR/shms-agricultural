import client from '@/../prisma/prismadb'

export async function GET(
  _req: Request,
  { params: { projectId } }: { params: { projectId: string } }
) {
  if (!projectId) throw new Error('Project ID is required')

  try {
    // using client from prisma/prismadb.ts instead of connectDB to query the database
    const project = await client.projects.findUnique({ where: { id: projectId } })

    return !project || !project.id
      ? new Response(
          JSON.stringify({ project: null, message: 'عفواً لم يتم العثور على المشروع!' }),
          { status: 404 }
        )
      : new Response(JSON.stringify({ project }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        project: null,
        message: 'عفواً، حدث خطأ ما أثناء جلب المشروع!'
      }),
      { status: 500 }
    )
  }
}

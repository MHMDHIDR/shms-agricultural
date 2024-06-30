import client from '@/../prisma/prismadb'

export async function GET(
  _req: Request,
  { params: { percentageCode } }: { params: { percentageCode: string } }
) {
  if (!percentageCode) throw new Error('Project ID is required')

  try {
    if (!percentageCode) {
      return new Response(
        JSON.stringify({ project: null, message: 'عفواً لم يتم العثور على المشروع!' }),
        { status: 404 }
      )
    }

    // Get project
    const project = await client.projects.findFirst({
      where: { shms_project_special_percentage_code: percentageCode }
    })

    // Return project
    return !project || !project.id
      ? new Response(
          JSON.stringify({
            isValid: false,
            message: 'عفواً الرمز المدخل غير صالح'
          }),
          { status: 404 }
        )
      : new Response(
          JSON.stringify({
            newPercentage: project.shms_project_special_percentage,
            isValid: true
          }),
          { status: 200 }
        )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        isValid: null,
        message: `عفواً، حدث خطأ غير متوقع! ${err}`
      }),
      { status: 500 }
    )
  }
}

import { connectDB } from '@/api/utils/db'
import type { ProjectProps } from '@/types'

export async function GET(
  _req: Request,
  { params: { projectId } }: { params: { projectId: string } }
) {
  if (!projectId) throw new Error('Project ID is required')

  try {
    if (!projectId) {
      return new Response(
        JSON.stringify({ project: null, message: 'عفواً لم يتم العثور على المشروع!' }),
        { status: 404 }
      )
    }

    // Get project
    const project = (
      (await connectDB(`SELECT * FROM projects WHERE shms_project_id = ?`, [
        projectId
      ])) as ProjectProps[]
    )[0]

    // Return project
    return !project || !project.shms_project_id
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
        message: `عفواً، لم يتم حذف المشروع! ${err}`
      }),
      { status: 500 }
    )
  }
}

import { connectDB } from '@/api/utils/db'
import type { ProjectProps } from '@/types'
import { ResultSetHeader } from 'mysql2/promise'

export async function DELETE(
  _request: Request,
  { params: { projectId } }: { params: { projectId: string } }
) {
  if (!projectId) throw new Error('User ID is required')

  try {
    // Check if project exists
    const project = (
      (await connectDB(`SELECT * FROM projects WHERE shms_project_id = ?`, [
        projectId
      ])) as ProjectProps[]
    )[0]

    // If project does not exist
    if (!project) {
      return new Response(
        JSON.stringify({
          projectDeleted: 0,
          message: 'عفواً لم يتم العثور على المشروع!'
        }),
        { status: 404 }
      )
    }

    // delete project
    const deleteUser = (await connectDB(
      `DELETE FROM projects WHERE shms_project_id = ?`,
      [projectId]
    )) as ResultSetHeader

    const { affectedRows: projectDeleted } = deleteUser as ResultSetHeader

    if (projectDeleted) {
      return new Response(
        JSON.stringify({ projectDeleted, message: `تم حذف المشروع بنجاح!` }),
        { status: 200 }
      )
    }

    return new Response(
      JSON.stringify({
        projectDeleted,
        message: `عفواً، لم يتم حذف المشروع بنجاح!`
      }),
      { status: 400 }
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        projectDeleted: 0,
        message: `عفواً، حدثت مشكلة غير متوقعة، حاول مرة أخرى لاحقاً!`
      }),
      { status: 500 }
    )
  }
}

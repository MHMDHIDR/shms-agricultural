import { connectDB } from '@/app/api/utils/db'
import type { ProjectProps } from '@/types'
import { ResultSetHeader } from 'mysql2/promise'
import { NextRequest } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params: { projectId } }: { params: { projectId: string } }
) {
  if (!projectId) throw new Error('User ID is required')

  const origin = req.headers.get('origin')

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
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
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
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
      )
    }

    return new Response(
      JSON.stringify({
        projectDeleted,
        message: `عفواً، لم يتم حذف المشروع بنجاح!`
      }),
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        projectDeleted: 0,
        message: `عفواً، حدثت مشكلة غير متوقعة، حاول مرة أخرى لاحقاً!`
      }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

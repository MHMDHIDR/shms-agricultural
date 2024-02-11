import { connectDB } from '@/app/api/utils/db'
import type { ProjectProps } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params: { projectId } }: { params: { projectId: string } }
) {
  if (!projectId) throw new Error('Project ID is required')

  const origin = req.headers.get('origin')

  try {
    if (!projectId) {
      return new NextResponse(
        JSON.stringify({ project: null, message: 'عفواً لم يتم العثور على المشروع!' }),
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        }
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
      ? new NextResponse(
          JSON.stringify({ project: null, message: 'عفواً لم يتم العثور على المشروع!' }),
          {
            status: 404,
            headers: {
              'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
              'Content-Type': 'application/json'
            }
          }
        )
      : new NextResponse(JSON.stringify({ project }), {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': origin || 'http://localhost:3000',
            'Content-Type': 'application/json'
          }
        })
  } catch (err) {
    console.error(err)
    return new NextResponse(
      JSON.stringify({
        project: null,
        message: `عفواً، لم يتم حذف المشروع! ${err}`
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

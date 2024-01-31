import { connectDB } from '@/app/api/utils/db'
import type { ProjectProps } from '@/types'
import { ResultSetHeader } from 'mysql2/promise'

export async function PATCH(
  request: Request,
  { params: { projectId } }: { params: { projectId: string } }
) {
  if (!projectId) throw new Error('Project ID is required')

  const {
    shms_project_images,
    shms_project_name,
    shms_project_location,
    shms_project_start_date,
    shms_project_end_date,
    shms_project_invest_date,
    shms_project_available_stocks,
    shms_project_stock_price,
    shms_project_stock_profits,
    shms_project_description,
    shms_project_status,
    updateImg
  }: ProjectProps = await request.json()

  if (!projectId) {
    return new Response(
      JSON.stringify({
        projectUpdated: 0,
        message: 'الرقم التعريفي الـ ID مطلوب لتحديث المشروع!'
      }),
      { status: 404 }
    )
  }

  try {
    // Get project
    const project = (
      (await connectDB(`SELECT * FROM projects WHERE shms_project_id = ?`, [
        projectId
      ])) as ProjectProps[]
    )[0]

    if (!project || !project.shms_project_id) {
      new Response(
        JSON.stringify({
          projectUpdated: 0,
          message: 'عفواً لم يتم العثور على المشروع!'
        }),
        { status: 404 }
      )
    }

    // Update project
    const updateProject = updateImg
      ? ((await connectDB(
          `UPDATE projects SET
              shms_project_images = ?
            WHERE shms_project_id = ?`,
          [JSON.stringify(shms_project_images), projectId]
        )) as ResultSetHeader)
      : ((await connectDB(
          `UPDATE projects SET
        shms_project_images = ?,
        shms_project_name = ?,
        shms_project_location = ?,
        shms_project_start_date = ?,
        shms_project_end_date = ?,
        shms_project_invest_date = ?,
        shms_project_available_stocks = ?,
        shms_project_stock_price = ?,
        shms_project_stock_profits = ?,
        shms_project_description = ?,
        shms_project_status = ?
      WHERE shms_project_id = ?`,
          [
            JSON.stringify(shms_project_images),
            shms_project_name,
            shms_project_location,
            shms_project_start_date,
            shms_project_end_date,
            shms_project_invest_date,
            shms_project_available_stocks,
            shms_project_stock_price,
            shms_project_stock_profits,
            shms_project_description ?? '',
            shms_project_status ?? 'pending',
            projectId
          ]
        )) as ResultSetHeader)

    const { affectedRows: projectUpdated } = updateProject as ResultSetHeader

    return projectUpdated
      ? new Response(
          JSON.stringify({
            projectUpdated,
            message: `تم تعديل المشروع بنجاح .. جاري تحويلك`
          }),
          { status: 200 }
        )
      : new Response(
          JSON.stringify({
            projectUpdated,
            message: `عفواً، لم يتم تعديل المشروع، يرجى المحاولة مرة أخرى`
          }),
          { status: 500 }
        )
  } catch (err) {
    return new Response(
      JSON.stringify({
        projectUpdated: 0,
        message: `عفواً، لم يتم تعديل المشروع! ${err}`
      }),
      { status: 500 }
    )
  }
}

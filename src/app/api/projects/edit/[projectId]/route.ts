import { connectDB } from '@/api/utils/db'
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
    shms_project_profits_collect_date,
    shms_project_total_stocks,
    shms_project_stock_price,
    shms_project_stock_profits,
    shms_project_special_percentage,
    shms_project_special_percentage_code,
    shms_project_description,
    shms_project_terms,
    shms_project_study_case,
    shms_project_study_case_visibility,
    shms_project_status,
    updateImg,
    updatePercentage
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
      return new Response(
        JSON.stringify({
          projectUpdated: 0,
          message: 'عفواً لم يتم العثور على المشروع!'
        }),
        { status: 404 }
      )
    }

    // Step 1: Retrieve the old value of shms_project_total_stocks before updating it
    const oldTotalStocks = project.shms_project_total_stocks

    // Update project
    const updateProject = updateImg
      ? ((await connectDB(
          `UPDATE projects SET
        shms_project_images = ?
      WHERE shms_project_id = ?`,
          [JSON.stringify(shms_project_images), projectId]
        )) as ResultSetHeader)
      : updatePercentage
      ? ((await connectDB(
          `UPDATE projects SET
            shms_project_special_percentage = ?,
            shms_project_special_percentage_code = ?
          WHERE shms_project_id = ?`,
          [
            shms_project_special_percentage,
            shms_project_special_percentage_code,
            projectId
          ]
        )) as ResultSetHeader)
      : ((await connectDB(
          `UPDATE projects SET
            shms_project_images = ?,
            shms_project_name = ?,
            shms_project_location = ?,
            shms_project_start_date = ?,
            shms_project_end_date = ?,
            shms_project_invest_date = ?,
            shms_project_profits_collect_date = ?,
            shms_project_total_stocks = ?,
            shms_project_stock_price = ?,
            shms_project_stock_profits = ?,
            shms_project_special_percentage = ?,
            shms_project_special_percentage_code = ?,
            shms_project_description = ?,
            shms_project_terms = ?,
            shms_project_study_case = ?,
            shms_project_study_case_visibility = ?,
            shms_project_status = ?
          WHERE shms_project_id = ?`,
          [
            JSON.stringify(shms_project_images),
            shms_project_name,
            shms_project_location,
            shms_project_start_date,
            shms_project_end_date,
            shms_project_invest_date,
            shms_project_profits_collect_date,
            shms_project_total_stocks,
            shms_project_stock_price,
            shms_project_stock_profits,
            shms_project_special_percentage || null,
            shms_project_special_percentage_code || null,
            shms_project_description,
            shms_project_terms,
            JSON.stringify(shms_project_study_case),
            shms_project_study_case_visibility,
            shms_project_status,
            projectId
          ]
        )) as ResultSetHeader)
    const { affectedRows: projectUpdated } = updateProject as ResultSetHeader

    // Step 2: Calculate the difference between the old and new values
    const stocksDifference = oldTotalStocks - shms_project_total_stocks

    // Step 3: Subtract this difference from the current value of shms_project_available_stocks
    const newAvailableStocks = project.shms_project_available_stocks - stocksDifference

    // Update shms_project_available_stocks with the new calculated value
    await connectDB(
      `UPDATE projects SET shms_project_available_stocks = ? WHERE shms_project_id = ?`,
      [newAvailableStocks, projectId]
    )

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
  } catch (error) {
    console.error('Error in projects/edit/[projectId]/route.ts', error)

    return new Response(
      JSON.stringify({
        projectUpdated: 0,
        message: `عفواً، لم يتم تعديل المشروع! ${error}`
      }),
      { status: 500 }
    )
  }
}

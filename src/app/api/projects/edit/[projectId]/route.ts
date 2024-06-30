import client from '@/../prisma/prismadb'
import type { Projects } from '@prisma/client'

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
  }: Projects = await request.json()

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
    const project = await client.projects.findUnique({ where: { id: projectId } })

    if (!project || !project.id) {
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

    if (updateImg) {
      console.log('updateImg...')

      await client.projects.update({
        where: { id: projectId },
        data: { shms_project_images }
      })
    } else if (updatePercentage) {
      await client.projects.update({
        where: { id: projectId },
        data: {
          shms_project_special_percentage: shms_project_special_percentage || null,
          shms_project_special_percentage_code:
            shms_project_special_percentage_code || null
        }
      })
    } else {
      await client.projects.update({
        where: { id: projectId },
        data: {
          shms_project_images,
          shms_project_name: shms_project_name.trim(),
          shms_project_location: shms_project_location.trim(),
          shms_project_start_date,
          shms_project_end_date,
          shms_project_invest_date,
          shms_project_profits_collect_date,
          shms_project_total_stocks,
          shms_project_stock_price,
          shms_project_stock_profits,
          shms_project_special_percentage: shms_project_special_percentage || null,
          shms_project_special_percentage_code:
            shms_project_special_percentage_code || null,
          shms_project_description: shms_project_description.trim(),
          shms_project_terms: (shms_project_terms ?? '').trim(),
          shms_project_study_case,
          shms_project_study_case_visibility,
          shms_project_status
        }
      })
    }

    // Step 2: Calculate the difference between the old and new values, Note: shms_project_total_stocks is the new value
    const stocksDifference = shms_project_total_stocks
      ? oldTotalStocks - shms_project_total_stocks
      : oldTotalStocks

    // Step 3: Subtract this difference from the current value of shms_project_available_stocks
    const newAvailableStocks = project.shms_project_available_stocks - stocksDifference

    // Only Update shms_project_available_stocks with the new calculated value if there is a difference in the total stocks value
    if (stocksDifference !== 0) {
      await client.projects.update({
        where: { id: projectId },
        data: { shms_project_available_stocks: newAvailableStocks }
      })
    }

    return new Response(
      JSON.stringify({
        projectUpdated: 1,
        message: `تم تعديل المشروع بنجاح .. جاري تحويلك`
      }),
      { status: 200 }
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

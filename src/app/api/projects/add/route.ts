import client from '@/../prisma/prismadb'
import type { Projects } from '@prisma/client'

export async function POST(req: Request) {
  const body = await req.json()
  const {
    id,
    shms_project_name,
    shms_project_location,
    shms_project_start_date,
    shms_project_end_date,
    shms_project_invest_date,
    shms_project_profits_collect_date,
    shms_project_total_stocks,
    shms_project_available_stocks,
    shms_project_stock_price,
    shms_project_stock_profits,
    shms_project_description,
    shms_project_terms,
    shms_project_images,
    shms_project_study_case
  }: Projects = body

  try {
    // add project to DB
    const newProject = await client.projects.create({
      data: {
        id,
        shms_project_images,
        shms_project_study_case,
        shms_project_study_case_visibility: false,
        shms_project_name,
        shms_project_location,
        shms_project_start_date,
        shms_project_end_date,
        shms_project_invest_date,
        shms_project_profits_collect_date,
        shms_project_available_stocks,
        shms_project_total_stocks,
        shms_project_stock_price,
        shms_project_stock_profits,
        shms_project_description,
        shms_project_terms
      }
    })

    const projectAdded = newProject.id

    return projectAdded
      ? new Response(
          JSON.stringify({ projectAdded, message: `تم إضافة المشروع بنجاح` }),
          { status: 201 }
        )
      : new Response(
          JSON.stringify({
            projectAdded,
            message: `عفواً، لم يتم إضافة المشروع، يرجى المحاولة مرة أخرى`
          }),
          { status: 500 }
        )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ projectAdded: 0, message: err }), {
      status: 500
    })
  }
}

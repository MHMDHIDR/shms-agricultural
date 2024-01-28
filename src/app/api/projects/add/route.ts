import { connectDB } from '@/app/api/utils/db'
import { ResultSetHeader } from 'mysql2/promise'
import type { ProjectProps } from '@/types'

export async function POST(req: Request) {
  const body = await req.json()
  const {
    shms_project_id,
    shms_project_name,
    shms_project_location,
    shms_project_start_date,
    shms_project_end_date,
    shms_project_invest_date,
    shms_project_stock_price,
    shms_project_stock_profits,
    shms_project_description,
    shms_project_images
  }: ProjectProps = body

  try {
    // add project to DB
    const newProject = await connectDB(
      `INSERT INTO projects (shms_project_id,
                          shms_project_images,
                          shms_project_name,
                          shms_project_location,
                          shms_project_start_date,
                          shms_project_end_date,
                          shms_project_invest_date,
                          shms_project_stock_price,
                          shms_project_stock_profits,
                          shms_project_description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        shms_project_id,
        // To store in DB we need to stringify the array
        JSON.stringify(shms_project_images),
        shms_project_name,
        shms_project_location,
        shms_project_start_date,
        shms_project_end_date,
        shms_project_invest_date,
        shms_project_stock_price,
        shms_project_stock_profits,
        shms_project_description
      ]
    )

    const { affectedRows: projectAdded } = newProject as ResultSetHeader

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
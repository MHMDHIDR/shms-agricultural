import { connectDB } from '@/app/api/utils/db'
import { APP_TITLE } from '@/data/constants'
import type { ProjectProps, UserProps, stocksPurchesedProps } from '@/types'
import { ResultSetHeader } from 'mysql2/promise'

export async function PATCH(req: Request) {
  const body = await req.json()
  const {
    userId: shms_id,
    shms_project_id,
    stocks,
    newPercentage,
    percentageCode,
    createdAt
  }: stocksPurchesedProps = body

  if (!shms_id) throw new Error('User ID is required')

  try {
    // Check if the user has enough balance
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_id = ?`, [shms_id])) as UserProps[]
    )[0]

    const project = (
      (await connectDB(`SELECT * FROM projects WHERE shms_project_id = ?`, [
        shms_project_id
      ])) as ProjectProps[]
    )[0]

    const userPrevStocks = getUserPrevStocks(user as UserProps)
    const projectAvailableStocks = getProjectStocks(project as ProjectProps)

    const { affectedRows: updateUserStocks } = (await connectDB(
      `UPDATE users SET shms_user_stocks = ? WHERE shms_id = ?;`,
      [
        //parse the previos stocks and add the new stocks
        ...userPrevStocks,
        JSON.stringify([
          {
            shms_project_id,
            stocks,
            newPercentage,
            percentageCode,
            createdAt
          }
        ]),
        shms_id
      ]
    )) as ResultSetHeader

    const { affectedRows: updateProjectAvailableStocks } = (await connectDB(
      `UPDATE projects SET shms_project_available_stocks = ? WHERE shms_project_id = ?`,
      [projectAvailableStocks - stocks, shms_project_id]
    )) as ResultSetHeader

    if (updateUserStocks && updateProjectAvailableStocks) {
      return new Response(
        JSON.stringify({
          stocksPurchesed: 1,
          message: `تم تأكيد عملية الشراء بنجاح وإرسال بريد الكتروني بالتفاصيل
         سيتم التواصل معك من فريق
         ${APP_TITLE}
         لتأكيد العملية ولإتمام باقي الإجراءات`
        })
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        stocksPurchesed: 0,
        message: 'لم يتم تأكيد عملية الشراء، حاول مرة أخرى'
      })
    )
  }
}

function getUserPrevStocks(user: UserProps) {
  if (!user || !user.shms_user_stocks || user.shms_user_stocks.length === 0) return []

  return user.shms_user_stocks
}

function getProjectStocks(project: ProjectProps) {
  if (!project || !project.shms_project_available_stocks) return 0

  return project.shms_project_available_stocks
}

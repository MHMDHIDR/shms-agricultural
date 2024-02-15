import { connectDB } from '@/api/utils/db'
import { ADMIN_EMAIL, APP_TITLE, APP_URL } from '@/data/constants'
import type { ProjectProps, UserProps, stocksPurchasedProps } from '@/types'
import email from '@/lib/actions/email'
import { generatePDF } from '@/api/utils/generate-pdf'
import { ResultSetHeader } from 'mysql2/promise'

export async function PATCH(req: Request) {
  const body = await req.json()
  const {
    userId: shms_id,
    shms_project_id,
    stocks,
    newPercentage,
    percentageCode
  }: stocksPurchasedProps = body

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

    if (userPrevStocks !== null) {
      await connectDB(`UPDATE users SET shms_user_stocks = ? WHERE shms_id = ?;`, [
        JSON.stringify([
          ...JSON.parse(String(userPrevStocks)),
          {
            shms_project_id,
            stocks,
            newPercentage,
            percentageCode,
            createdAt: new Date().toISOString()
          }
        ]),
        shms_id
      ])
    } else {
      await connectDB(`UPDATE users SET shms_user_stocks = ? WHERE shms_id = ?;`, [
        JSON.stringify([
          {
            shms_project_id,
            stocks,
            newPercentage,
            percentageCode,
            createdAt: new Date().toISOString()
          }
        ]),
        shms_id
      ])
    }

    const updateProjectAvaStocks = await connectDB(
      `UPDATE projects SET shms_project_available_stocks = ? WHERE shms_project_id = ?`,
      [projectAvailableStocks - stocks, shms_project_id]
    )
    const { affectedRows: projectUpdated } = updateProjectAvaStocks as ResultSetHeader

    //send the user an email with a link to activate his/her account
    const buttonLink = APP_URL + `/profile/investments`
    const adminButtonLink = APP_URL + `/dashboard`

    const pdfToSend = await generatePDF({
      investorName: String(user?.shms_fullname),
      projectName: String(project?.shms_project_name!),
      stocksPurchased: String(stocks),
      totalAmount: String(stocks * project?.shms_project_stock_price!),
      totalProfit: String(
        newPercentage > 0
          ? stocks * project?.shms_project_stock_profits! +
              (stocks * project?.shms_project_stock_profits! * newPercentage) / 100
          : stocks * project?.shms_project_stock_profits!
      ),
      profitsCollectDate: String(project?.shms_project_profits_collect_date),
      referenceCode: `#${shms_id}#${shms_project_id}#${new Date().getTime()}`
    })

    const investorEmailData = {
      subject: `تم شراء أسهم من ${project?.shms_project_name} بنجاح | شمس للخدمات الزراعية`,
      from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
      to: user?.shms_email ?? '',
      msg: {
        title: 'مرحباً بك في شمس للخدمات الزراعية',
        msg: `
        مرحباً ${user?.shms_fullname},

          شكراً لمساهمتك معنا في ${project?.shms_project_name}،
          تم شراء
          ${stocks} أسهم بنجاح.
          يمكنك الآن تصفح استثماراتك في حسابك من خلال الرابط أدناه:`,
        buttonLink,
        buttonLabel: 'تصفح استثماراتك'
      },
      pdfToSend
    }

    const adminEmailData = {
      from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `تم شراء عدد ${stocks} أسهم من ${project?.shms_project_name} بنجاح | شمس للخدمات الزراعية`,
      msg: {
        title: 'مرحباً بك في شمس للخدمات الزراعية',
        msg: `
        تم شراء عدد ${stocks} أسهم من ${project?.shms_project_name}  بنجاح،
        بواسطة ${user?.shms_fullname} (${user?.shms_email})`,
        buttonLink: adminButtonLink,
        buttonLabel: 'تصفح الاستثمارات'
      },
      pdfToSend
    }

    // Promoise.all
    const data = await Promise.all([
      await email(investorEmailData),
      await email(adminEmailData)
    ])

    if (projectUpdated || (data[0] && data[1])) {
      return new Response(
        JSON.stringify({
          stocksPurchesed: 1,
          message: `تم تأكيد عملية الشراء بنجاح وإرسال بريد الكتروني بالتفاصيل
         سيتم التواصل معك من فريق 
         ${APP_TITLE}
         لتأكيد العملية ولإتمام باقي الإجراءات`,
          pdfToSend
        }),
        { status: 200 }
      )
    } else {
      return new Response(
        JSON.stringify({
          stocksPurchesed: 0,
          message: 'لم يتم تأكيد عملية الشراء، حاول مرة أخرى'
        }),
        { status: 500 }
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
  if (!user || !user.shms_user_stocks || user.shms_user_stocks.length === 0) return null

  return user.shms_user_stocks
}

function getProjectStocks(project: ProjectProps) {
  if (!project || !project.shms_project_available_stocks) return 0

  return project.shms_project_available_stocks
}
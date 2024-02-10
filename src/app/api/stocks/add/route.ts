import { connectDB } from '@/app/api/utils/db'
import { ADMIN_EMAIL, APP_TITLE, APP_URL } from '@/data/constants'
import type { ProjectProps, UserProps, stocksPurchesedProps } from '@/types'
import email, { customEmail } from '@/app/api/utils/email'

export async function PATCH(req: Request) {
  const body = await req.json()
  const {
    userId: shms_id,
    shms_project_id,
    stocks,
    newPercentage,
    percentageCode
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

    console.log(' userPrevStocks -->', userPrevStocks)

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

    await connectDB(
      `UPDATE projects SET shms_project_available_stocks = ? WHERE shms_project_id = ?`,
      [projectAvailableStocks - stocks, shms_project_id]
    )

    //send the user an email with a link to activate his/her account
    const buttonLink = APP_URL + `/profile/investments`
    const adminButtonLink = APP_URL + `/dashboard`

    const investorEmailData = {
      from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
      to: user?.shms_email,
      subject: `تم شراء أسهم من ${project?.shms_project_name} بنجاح | شمس للخدمات الزراعية`,
      msg: customEmail({
        title: 'مرحباً بك في شمس للخدمات الزراعية',
        msg: `
            <h1 style="font-weight:bold">مرحباً ${user?.shms_fullname},</h1>
            <p>
             شكراً لمساهمتك معنا في ${project?.shms_project_name}،
             تم شراء أسهم بنجاح، يمكنك الآن تصفح استثماراتك في حسابك من خلال الرابط أدناه:
            </p>
            <br /><br />
            <small>إذا كنت تعتقد أن هذا البريد الالكتروني وصلك بالخطأ، أو أن هنالك مشكلة ما، يرجى تجاهل هذا البريد من فضلك!</small>`,
        buttonLink,
        buttonLabel: 'تصفح استثماراتك'
      })
    }

    const adminEmailData = {
      from: `شمس للخدمات الزراعية | SHMS Agriculture <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `تم شراء عدد ${stocks} أسهم من ${project?.shms_project_name} بنجاح | شمس للخدمات الزراعية`,
      msg: customEmail({
        title: `تم شراء أسهم من ${project?.shms_project_name}`,
        msg: `
          <p>
            تم شراء عدد ${stocks} أسهم من ${project?.shms_project_name}  بنجاح،
            <br /><br />
            بواسطة ${user?.shms_fullname} (${user?.shms_email})
          </p>`,
        buttonLink: adminButtonLink,
        buttonLabel: 'تصفح الاستثمارات'
      })
    }

    const { accepted, rejected } = await email(investorEmailData)
    await email(adminEmailData)
    if (accepted.length > 0) {
      return new Response(
        JSON.stringify({
          stocksPurchesed: 1,
          message: `تم تأكيد عملية الشراء بنجاح وإرسال بريد الكتروني بالتفاصيل
         سيتم التواصل معك من فريق 
         ${APP_TITLE}
         لتأكيد العملية ولإتمام باقي الإجراءات`
        }),
        { status: 200 }
      )
    } else if (rejected.length > 0) {
      return new Response(
        JSON.stringify({
          stocksPurchesed: 0,
          message: 'لم يتم تأكيد عملية الشراء، حاول مرة أخرى'
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
  if (!user || !user.shms_user_stocks || user.shms_user_stocks.length === 0) return null

  return user.shms_user_stocks
}

function getProjectStocks(project: ProjectProps) {
  if (!project || !project.shms_project_available_stocks) return 0

  return project.shms_project_available_stocks
}

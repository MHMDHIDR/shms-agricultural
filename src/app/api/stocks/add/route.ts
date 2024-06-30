import client from '@/../prisma/prismadb'
import { ADMIN_EMAIL, APP_TITLE, APP_URL } from '@/data/constants'
import email from '@/libs/actions/email'
import type { stocksPurchasedProps } from '@/types'
import type { Projects, Users } from '@prisma/client'

export async function PATCH(req: Request) {
  const body = await req.json()
  const {
    userId,
    id,
    stocks,
    newPercentage,
    percentageCode,
    paymentMethod
  }: stocksPurchasedProps = body

  if (!userId) throw new Error('User ID is required')

  try {
    // Check if the user has enough balance
    const [user, project] = await Promise.all([
      client.users.findUnique({ where: { id: userId } }),
      client.projects.findUnique({ where: { id } })
    ])

    // if user or project not found
    if (!user || !project) {
      return new Response(
        JSON.stringify({
          stocksPurchased: 0,
          message: 'عفواً حدث خطأ ما، حاول مرة أخرى'
        }),
        { status: 500 }
      )
    }

    // if paymentMethod === 'balance' then check if the user has enough balance
    if (paymentMethod === 'balance') {
      if (
        user.shms_user_withdrawable_balance <
        stocks * project.shms_project_stock_price
      ) {
        return new Response(
          JSON.stringify({
            stocksPurchased: 0,
            message: 'رصيدك غير كافي، لإتمام عملية الشراء'
          }),
          { status: 400 }
        )
      }
    }

    const userPrevStocks = getUserPrevStocks(user)
    const userPrevWithdrawableBalance = getUserPrevWithdrawableBalance(user)
    const userPrevTotalBalance = getUserPrevTotalBalance(user)
    const projectAvailableStocks = getProjectStocks(project)
    const newWithdrawableBalance =
      Number(userPrevWithdrawableBalance) - stocks * project.shms_project_stock_price
    const newTotalBalance =
      Number(userPrevTotalBalance) + stocks * project.shms_project_stock_price

    // Construct the new user stocks array based on the condition
    const newUserStocks =
      userPrevStocks !== null && Array.isArray(userPrevStocks)
        ? [
            ...userPrevStocks,
            {
              id,
              stocks,
              newPercentage,
              percentageCode,
              createdAt: new Date().toISOString()
            }
          ]
        : [
            {
              id,
              stocks,
              newPercentage,
              percentageCode,
              createdAt: new Date().toISOString()
            }
          ]

    // Use newUserStocks array in the query
    await client.users.update({
      where: { id: userId },
      data: {
        shms_user_stocks: newUserStocks,
        ...(paymentMethod === 'balance'
          ? {
              shms_user_withdrawable_balance: newWithdrawableBalance,
              shms_user_total_balance: newTotalBalance
            }
          : {})
      }
    })

    await client.projects.update({
      where: { id },
      data: {
        shms_project_available_stocks: projectAvailableStocks - stocks
      }
    })

    //send the user an email with a link to activate his/her account
    const buttonLink = APP_URL + `/profile/investments`
    const adminButtonLink = APP_URL + `/dashboard`

    const investorEmailData = {
      subject: `تم شراء أسهم من ${project.shms_project_name} بنجاح | ${APP_TITLE}`,
      from: `${APP_TITLE} | SHMS Agriculture <${ADMIN_EMAIL}>`,
      to: user.shms_email || '',
      msg: {
        title: 'مرحباً بك في شمس للخدمات الزراعية',
        msg: `
        مرحباً ${user.shms_fullname},

          شكراً لمساهمتك معنا في ${project.shms_project_name}،
          تم شراء
          ${stocks} أسهم بنجاح.
          يمكنك الآن تصفح استثماراتك في حسابك من خلال الرابط أدناه:`,
        buttonLink,
        buttonLabel: 'تصفح استثماراتك'
      }
    }

    const adminEmailData = {
      from: `${APP_TITLE} | SHMS Agriculture <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `تم شراء عدد ${stocks} أسهم من ${project.shms_project_name} بنجاح | ${APP_TITLE}`,
      msg: {
        title: 'مرحباً بك في شمس للخدمات الزراعية',
        msg: `
        تم شراء عدد ${stocks} أسهم من ${project.shms_project_name}  بنجاح،
        بواسطة ${user.shms_fullname} (${user.shms_email})`,
        buttonLink: adminButtonLink,
        buttonLabel: 'تصفح الاستثمارات'
      }
    }

    // Promise.all
    const data = await Promise.all([email(investorEmailData), email(adminEmailData)])

    if (data[0] && data[1]) {
      return new Response(
        JSON.stringify({
          stocksPurchased: 1,
          message: `تم تأكيد عملية الشراء بنجاح وإرسال بريد الكتروني بالتفاصيل
         سيتم التواصل معك من فريق 
         ${APP_TITLE}
         لتأكيد العملية ولإتمام باقي الإجراءات`
        }),
        { status: 200 }
      )
    } else {
      return new Response(
        JSON.stringify({
          stocksPurchased: 0,
          message: 'لم يتم تأكيد عملية الشراء، حاول مرة أخرى'
        }),
        { status: 500 }
      )
    }
  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({
        stocksPurchased: 0,
        message: 'لم يتم تأكيد عملية الشراء، حاول مرة أخرى'
      }),
      { status: 500 }
    )
  }
}

function getUserPrevStocks(user: Users) {
  if (!user || !user.shms_user_stocks || user.shms_user_stocks.length === 0) return null

  return user.shms_user_stocks
}

function getUserPrevWithdrawableBalance(user: Users) {
  if (
    !user ||
    !user.shms_user_withdrawable_balance ||
    user.shms_user_withdrawable_balance === 0
  )
    return null

  return user.shms_user_withdrawable_balance
}

function getUserPrevTotalBalance(user: Users) {
  if (!user || !user.shms_user_total_balance || user.shms_user_total_balance === 0)
    return null

  return user.shms_user_total_balance
}

function getProjectStocks(project: Projects) {
  if (!project || !project.shms_project_available_stocks) return 0

  return project.shms_project_available_stocks
}

import { connectDB } from '@/api/utils/db'
import { ResultSetHeader } from 'mysql2/promise'
import type { ProjectProps, stocksPurchasedProps, UserProps } from '@/types'

export async function PATCH(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  const body = await req.json()
  const { dateOfPurchase }: { dateOfPurchase: stocksPurchasedProps['createdAt'] } = body

  try {
    // Check if user exists
    const user = (
      (await connectDB(`SELECT * FROM users WHERE shms_id = ?`, [userId])) as UserProps[]
    )[0]

    // If user does not exist
    if (!user) {
      return new Response(
        JSON.stringify({ userUpdated: 0, message: 'عفواً لم يتم العثور على الحساب!' }),
        { status: 404 }
      )
    }

    const currentUserStocks: stocksPurchasedProps[] = JSON.parse(
      String(user.shms_user_stocks)
    )
    let projectStocksToUpdate = ''
    let newUserStocks: stocksPurchasedProps[] = []
    // @ts-ignore
    let stocksToReturnBack: number

    // Filter out the stock object with the matching createdAt date
    // projectStocksToUpdate = stock.shms_project_id
    // return currentUserStocks without the stock object with the matching createdAt date
    newUserStocks = currentUserStocks.filter((stock: stocksPurchasedProps) => {
      if (stock.createdAt === dateOfPurchase) {
        projectStocksToUpdate = stock.shms_project_id
        stocksToReturnBack = stock.stocks
        return false
      }

      return true
    })

    // Fetch the project details associated with the projectStocksToUpdate
    const projectDetails = (
      (await connectDB(`SELECT * FROM projects WHERE shms_project_id = ?`, [
        projectStocksToUpdate
      ])) as ProjectProps[]
    )[0]

    // Update the user's shms_user_stocks array in the database
    const updateUserStocks = await connectDB(
      `UPDATE users SET shms_user_stocks = ?
        WHERE shms_id = ?`,
      [newUserStocks.length === 0 ? null : JSON.stringify(newUserStocks), userId]
    )
    const { affectedRows: userUpdated } = updateUserStocks as ResultSetHeader

    // Calculate the difference between the new and old stock values
    const prevStocks =
      currentUserStocks.find(stock => stock.shms_project_id === projectStocksToUpdate)
        ?.stocks || 0

    // Update the project's shms_project_available_stocks in the database
    await connectDB(
      `UPDATE projects SET shms_project_available_stocks = ?
        WHERE shms_project_id = ?`,
      [
        (projectDetails?.shms_project_available_stocks ?? 0) + prevStocks,
        projectStocksToUpdate
      ]
    )

    if (userUpdated) {
      return new Response(
        JSON.stringify({ userUpdated, message: `تم حذف أسهم المستثمر بنجاح!` }),
        { status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ userUpdated, message: `عفواً، لم يتم حذف أسهم المستثمر بنجاح!` }),
      { status: 400 }
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({
        userUpdated: 0,
        message: `عفواً، حدثت مشكلة غير متوقعة، حاول مرة أخرى لاحقاً!`
      }),
      { status: 500 }
    )
  }
}

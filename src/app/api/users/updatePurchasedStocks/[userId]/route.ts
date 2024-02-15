import { connectDB } from '@/api/utils/db'
import { ResultSetHeader } from 'mysql2/promise'
import type { ProjectProps, stocksPurchasedProps, UserProps } from '@/types'

export async function PATCH(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  const body = await req.json()
  const {
    stocks,
    dateOfPurchase
  }: {
    stocks: stocksPurchasedProps['stocks']
    dateOfPurchase: stocksPurchasedProps['createdAt']
  } = body

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

    const prevStockValue: stocksPurchasedProps[] = JSON.parse(
      String(user.shms_user_stocks)
    )
    let projectStocksToUpdate = ''

    // Filter the user.shms_user_stocks array to find the object with matching createdAt date
    const stockValueToEdit = prevStockValue.map((stock: stocksPurchasedProps) => {
      if (stock.createdAt === dateOfPurchase) {
        projectStocksToUpdate = stock.shms_project_id
        return { ...stock, stocks }
      }

      return stock
    })

    // Update user's shms_user_stocks array with the modified stockValueToEdit
    user.shms_user_stocks = stockValueToEdit

    // Then proceed with updating the user stocks in the database
    const updateUser = await connectDB(
      `UPDATE users SET shms_user_stocks = ?
        WHERE shms_id = ?`,
      [JSON.stringify(stockValueToEdit), userId]
    )

    const { affectedRows: userUpdated } = updateUser as ResultSetHeader

    // Fetch the project details associated with the projectStocksToUpdate
    const projectDetails = (
      (await connectDB(`SELECT * FROM projects WHERE shms_project_id = ?`, [
        projectStocksToUpdate
      ])) as ProjectProps[]
    )[0]

    // Calculate the difference between the new and old stock values
    const oldStocks =
      prevStockValue.find(stock => stock.shms_project_id === projectStocksToUpdate)
        ?.stocks || 0
    const newStocks =
      stockValueToEdit.find(stock => stock.shms_project_id === projectStocksToUpdate)
        ?.stocks || 0
    const stocksDifference = newStocks - oldStocks

    // Update the project's shms_project_available_stocks accordingly
    let updatedAvailableStocks = projectDetails?.shms_project_available_stocks ?? 0

    if (stocksDifference > 0) {
      // Increase shms_project_available_stocks if new stocks are added
      updatedAvailableStocks -= stocksDifference
    } else if (stocksDifference < 0) {
      // Decrease shms_project_available_stocks if stocks are sold
      updatedAvailableStocks += Math.abs(stocksDifference)
    }

    // Update the project's shms_project_available_stocks in the database
    await connectDB(
      `UPDATE projects SET shms_project_available_stocks = ?
        WHERE shms_project_id = ?`,
      [updatedAvailableStocks, projectStocksToUpdate]
    )

    // const userUpdated = true
    if (userUpdated) {
      return new Response(
        JSON.stringify({ userUpdated, message: `تم تحديث أسهم المستثمر بنجاح!` }),
        { status: 200 }
      )
    }

    return new Response(
      JSON.stringify({
        userUpdated,
        message: `عفواً، لم يتم تحديث أسهم المستثمر بنجاح!`
      }),
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

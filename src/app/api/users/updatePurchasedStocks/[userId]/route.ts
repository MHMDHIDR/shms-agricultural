// src/app/api/users/updatePurchasedStocks/[userId]/route.ts :

import client from '@/../prisma/prismadb'
import type { Stocks } from '@prisma/client'

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
    stocks: Stocks['stocks']
    dateOfPurchase: Stocks['createdAt']
  } = body

  try {
    // Ensure dateOfPurchase is in the correct format
    const purchaseDate = new Date(dateOfPurchase)

    // Fetch user details
    const user = await client.users.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return new Response(
        JSON.stringify({ userUpdated: 0, message: 'عفواً لم يتم العثور على الحساب!' }),
        { status: 404 }
      )
    }

    const prevStockValue: Stocks[] = user.shms_user_stocks
    let projectStocksToUpdate = ''
    let stockValueToEdit: Stocks[] = []

    // Find and update the stock object with the matching createdAt date
    stockValueToEdit = prevStockValue.map((stock: Stocks) => {
      const stockDate = new Date(stock.createdAt).toISOString()
      const targetDate = purchaseDate.toISOString()

      if (stockDate === targetDate) {
        projectStocksToUpdate = stock.id
        return { ...stock, stocks }
      }
      return stock
    })

    // Check if projectStocksToUpdate was set correctly
    if (!projectStocksToUpdate) {
      return new Response(
        JSON.stringify({
          userUpdated: 0,
          message: 'لم يتم العثور على المشروع المتعلق بهذا السهم!'
        }),
        { status: 404 }
      )
    }

    // Update user's shms_user_stocks array with the modified stockValueToEdit
    user.shms_user_stocks = stockValueToEdit

    // Update the user stocks in the database
    const userUpdated = await client.users.update({
      where: { id: userId },
      data: {
        shms_user_stocks: stockValueToEdit
      }
    })

    // Fetch the project details associated with the projectStocksToUpdate
    const projectDetails = await client.projects.findUnique({
      where: { id: projectStocksToUpdate }
    })

    // Calculate the difference between the new and old stock values
    const oldStocks =
      prevStockValue.find(stock => stock.id === projectStocksToUpdate)?.stocks || 0
    const newStocks =
      stockValueToEdit.find(stock => stock.id === projectStocksToUpdate)?.stocks || 0
    const stocksDifference = newStocks - oldStocks

    // Update the project's shms_project_available_stocks accordingly
    let updatedAvailableStocks = projectDetails?.shms_project_available_stocks ?? 0

    if (stocksDifference > 0) {
      updatedAvailableStocks -= stocksDifference
    } else if (stocksDifference < 0) {
      updatedAvailableStocks += Math.abs(stocksDifference)
    }

    // Update the project's shms_project_available_stocks in the database
    await client.projects.update({
      where: { id: projectStocksToUpdate },
      data: { shms_project_available_stocks: updatedAvailableStocks }
    })

    // if userUpdated is updated successfully then return userUpdated as 1
    if (userUpdated) {
      return new Response(
        JSON.stringify({ userUpdated: 1, message: 'تم تحديث أسهم المستثمر بنجاح!' }),
        { status: 200 }
      )
    }

    return new Response(
      JSON.stringify({
        userUpdated: userUpdated,
        message: 'عفواً، لم يتم تحديث أسهم المستثمر بنجاح!'
      }),
      { status: 400 }
    )
  } catch (error) {
    console.error(error)

    return new Response(
      JSON.stringify({
        userUpdated: 0,
        message: `عفواً، حدثت مشكلة غير متوقعة، حاول مرة أخرى لاحقاً! ${error}`
      }),
      { status: 500 }
    )
  }
}

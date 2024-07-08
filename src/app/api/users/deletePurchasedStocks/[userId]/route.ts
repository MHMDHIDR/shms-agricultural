import client from '@/../prisma/prismadb'
import type { Stocks } from '@prisma/client'

export async function PATCH(
  req: Request,
  { params: { userId } }: { params: { userId: string } }
) {
  if (!userId) throw new Error('User ID is required')

  const body = await req.json()
  let { dateOfPurchase }: { dateOfPurchase: Stocks['createdAt'] } = body

  try {
    // Ensure dateOfPurchase is in the correct format
    dateOfPurchase = new Date(dateOfPurchase)

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

    const currentUserStocks: Stocks[] = user.shms_user_stocks
    let projectStocksToUpdate = ''
    let newUserStocks: Stocks[] = []
    let stocksToReturnBack = 0

    // Filter out the stock object with the matching createdAt date
    newUserStocks = currentUserStocks.filter((stock: Stocks) => {
      const stockDate = new Date(stock.createdAt).toISOString()
      const purchaseDate = new Date(dateOfPurchase).toISOString()

      if (stockDate === purchaseDate) {
        projectStocksToUpdate = stock.id
        stocksToReturnBack = stock.stocks

        return false // Remove this stock from the list
      }
      return true // Keep other stocks
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

    // Fetch project details
    const project = await client.projects.findUnique({
      where: { id: projectStocksToUpdate }
    })

    // Update user's stocks in the database
    const userUpdated = await client.users.update({
      where: { id: userId },
      data: {
        shms_user_stocks: newUserStocks
      }
    })

    // Update project's available stocks
    if (project) {
      await client.projects.update({
        where: { id: projectStocksToUpdate },
        data: {
          shms_project_available_stocks:
            (project.shms_project_available_stocks ?? 0) + stocksToReturnBack
        }
      })
    }

    // if userUpdated is updated successfully then return userUpdated as 1
    if (userUpdated) {
      return new Response(
        JSON.stringify({ userUpdated: 1, message: 'تم حذف أسهم المستثمر بنجاح!' }),
        { status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ userUpdated, message: 'عفواً، لم يتم حذف أسهم المستثمر بنجاح!' }),
      { status: 400 }
    )
  } catch (error: any) {
    console.error(error)

    return new Response(
      JSON.stringify({
        userUpdated: 0,
        message: `عفواً، حدثت مشكلة غير متوقعة، حاول مرة أخرى لاحقاً: ${error}`
      }),
      { status: 500 }
    )
  }
}

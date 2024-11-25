'use server'

import client from '@/../prisma/prismadb'
import { Projects } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function depositCapitalOrProfits(
  depositType: 'capital' | 'profits',
  projectId: Projects['id']
) {
  try {
    // Find all users with stocks for the specific project
    const users = await client.users.findMany({
      where: {
        shms_user_stocks: {
          some: {
            id: projectId // Filter for specific project
          }
        }
      }
    })

    // Find the specific project once
    const project = await client.projects.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return { success: false, message: 'المشروع غير موجود' }
    }

    // Iterate through each user
    for (const user of users) {
      if (!user.shms_user_stocks) continue

      let totalCredits = 0
      let updatedStocks: any[] = []

      // Iterate through user's stocks
      for (const stock of user.shms_user_stocks) {
        if (stock.id === projectId) {
          // Only process stocks for this specific project
          const stockCredits = stock.stocks * project.shms_project_stock_price

          if (depositType === 'capital' && stock.capitalDeposited) {
            return { success: false, message: 'تم إيداع رأس المال لهذا المشروع سابقاً!' }
          }

          if (depositType === 'profits' && stock.profitsDeposited) {
            return { success: false, message: 'تم إيداع الأرباح لهذا المشروع سابقاً!' }
          }

          if (depositType === 'capital' && !stock.capitalDeposited) {
            totalCredits += stockCredits
            updatedStocks.push({ ...stock, capitalDeposited: true })
          }

          if (depositType === 'profits' && !stock.profitsDeposited) {
            // Calculate profits percentage
            const profitPercentage = stock.newPercentage || 0
            const stockProfits = project.shms_project_stock_profits

            // Calculate additional profit based on percentage
            const additionalProfit = stockProfits * (profitPercentage / 100)

            // Total profit for this stock
            const totalStockProfit = stockProfits + additionalProfit

            if (stock.capitalDeposited) {
              // If capital was already deposited, only add profits
              totalCredits += totalStockProfit * stock.stocks
            } else {
              // If capital wasn't deposited yet, add both capital and profits
              totalCredits += totalStockProfit * stock.stocks + stockCredits
            }

            updatedStocks.push({
              ...stock,
              capitalDeposited: true,
              profitsDeposited: true
            })
          }
        } else {
          // Keep other projects' stocks unchanged
          updatedStocks.push(stock)
        }
      }

      // Update user credits only if there are changes
      if (totalCredits > 0) {
        await client.users.update({
          where: { id: user.id },
          data: {
            shms_user_credits: { increment: totalCredits },
            shms_user_stocks: updatedStocks
          }
        })
      }
    }

    revalidatePath('/dashboard/projects')

    return {
      success: true,
      message:
        depositType === 'capital'
          ? 'تم إيداع رأس المال للمشروع المحدد'
          : 'تم إيداع الأرباح للمشروع المحدد'
    }
  } catch (error) {
    console.error('Deposit error:', error)
    return {
      success: false,
      message: 'حدث خطأ أثناء عملية الإيداع',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function resetCredit(
  projectId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Find all users who have stocks in this specific project
    const users = await client.users.findMany({
      where: {
        shms_user_stocks: { some: { id: projectId } }
      }
    })

    // Iterate through each user
    for (const user of users) {
      if (!user.shms_user_stocks) continue

      let updatedStocks: any[] = []
      let creditsToDeduct = 0

      // Find the specific project
      const project = await client.projects.findUnique({
        where: { id: projectId }
      })

      if (!project) continue

      // Iterate through each stock of the user
      for (const stock of user.shms_user_stocks) {
        if (stock.id === projectId) {
          // Calculate credits to deduct for this project
          const baseStockValue = stock.stocks * project.shms_project_stock_price

          if (stock.capitalDeposited) {
            creditsToDeduct += baseStockValue
          }

          if (stock.profitsDeposited) {
            const profitPercentage = stock.newPercentage || 0
            const stockProfits = project.shms_project_stock_profits
            const additionalProfit = stockProfits * (profitPercentage / 100)
            const totalStockProfit = (stockProfits + additionalProfit) * stock.stocks
            creditsToDeduct += totalStockProfit
          }

          // Reset the deposit flags for this project only
          updatedStocks.push({
            ...stock,
            capitalDeposited: false,
            profitsDeposited: false
          })
        } else {
          // Keep other projects' stocks unchanged
          updatedStocks.push(stock)
        }
      }

      // Update user credits by deducting only the amount from this project
      await client.users.update({
        where: { id: user.id },
        data: {
          shms_user_credits: { decrement: creditsToDeduct },
          shms_user_stocks: updatedStocks
        }
      })
    }

    revalidatePath('/dashboard/projects')

    return {
      success: true,
      message: 'تم إعادة تعيين الرصيد للمشروع المحدد'
    }
  } catch (error) {
    console.error('Reset credit error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export type InvestmentDataPoint = {
  date: string
  totalValue: number
  baseValue: number
  profitValue: number
  stocks: Array<{
    id: string
    value: number
    baseValue: number
    profitValue: number
    label: string
  }>
}

export type StockMetrics = {
  stockId: string
  purchaseDate: Date
  profitCollectDate: Date
  numberOfStocks: number
  stockPrice: number
  profitPerStock: number
  specialPercentage: number
  label?: string
}

export type TimeRange = {
  value: string
  label: string
  days: number
}

export function calculateDynamicTimeRanges(startDate: Date, endDate: Date): TimeRange[] {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const ranges: TimeRange[] = []

  // Add ranges based on total days
  if (totalDays >= 90) {
    ranges.push({ value: "90d", label: "آخر 3 أشهر", days: 90 })
  }
  if (totalDays >= 30) {
    ranges.push({ value: "30d", label: "آخر 30 يوم", days: 30 })
  }
  if (totalDays >= 7) {
    ranges.push({ value: "7d", label: "آخر 7 أيام", days: 7 })
  }

  // Always add the full range
  ranges.unshift({
    value: "all",
    label: `كامل الفترة (${totalDays} يوم)`,
    days: totalDays,
  })

  // If no standard ranges fit, add a custom range
  if (ranges.length === 1 && totalDays > 1) {
    ranges.push({
      value: `${totalDays}d`,
      label: `آخر ${totalDays} يوم`,
      days: totalDays,
    })
  }

  return ranges.reverse()
}

export function calculateInvestmentMetrics(
  stocks: StockMetrics[],
  startDate: Date,
  endDate: Date,
): InvestmentDataPoint[] {
  const dailyData: InvestmentDataPoint[] = []
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  for (let i = 0; i <= days; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(currentDate.getDate() + i)
    const dateStr = currentDate.toISOString().split("T")[0] ?? ""

    let totalValue = 0
    let baseValue = 0
    let profitValue = 0
    const stockValues: InvestmentDataPoint["stocks"] = []

    stocks.forEach((stock, index) => {
      if (currentDate >= stock.purchaseDate) {
        // Base investment value for this stock
        const baseStockValue = stock.numberOfStocks * stock.stockPrice

        // Calculate profit based on time progression
        const totalDays = Math.ceil(
          (stock.profitCollectDate.getTime() - stock.purchaseDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
        const daysPassed = Math.ceil(
          (currentDate.getTime() - stock.purchaseDate.getTime()) / (1000 * 60 * 60 * 24),
        )
        const progressRatio = Math.min(daysPassed / totalDays, 1)

        // Calculate profit including special percentage
        const baseProfit = stock.profitPerStock * stock.numberOfStocks
        const specialProfitMultiplier = 1 + stock.specialPercentage / 100
        const stockProfit = baseProfit * specialProfitMultiplier * progressRatio

        // Add to totals
        baseValue += baseStockValue
        profitValue += stockProfit

        // Track individual stock values
        stockValues.push({
          id: stock.stockId,
          value: baseStockValue + stockProfit,
          baseValue: baseStockValue,
          profitValue: stockProfit,
          label: stock.label ?? `استثمار ${index + 1}`,
        })
      }
    })

    totalValue = baseValue + profitValue

    dailyData.push({
      date: dateStr,
      totalValue: Math.round(totalValue),
      baseValue: Math.round(baseValue),
      profitValue: Math.round(profitValue),
      stocks: stockValues,
    })
  }

  return dailyData
}

export function getDateRangeFromPeriod(
  period: string,
  referenceDate: Date = new Date(),
): { startDate: Date; endDate: Date } {
  const endDate = new Date(referenceDate)
  const startDate = new Date(referenceDate)

  // Handle "all" range
  if (period === "all") {
    return { startDate, endDate }
  }

  // Handle dynamic day ranges (e.g., "90d", "30d", "7d", "15d", etc.)
  const days = parseInt(period.replace("d", ""))
  if (!isNaN(days)) {
    startDate.setDate(startDate.getDate() - days)
  }

  return { startDate, endDate }
}

import Link from "next/link"
import { Metric } from "@/components/custom/icons"
import { InvestmentChart } from "@/components/custom/investment-chart"
import NoRecords from "@/components/custom/no-records"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { calculateInvestmentMetrics } from "@/lib/calculate-investment-metrics"
import { api } from "@/trpc/server"
import { UserStocksTable } from "./user-stocks-table"
import type { StockMetrics } from "@/lib/calculate-investment-metrics"

export default async function Dashboard() {
  const user = await api.user.getUserInfo({ select: { credits: true, stocks: true } })
  const stocksWithProjects = await Promise.all(
    (user?.stocks ?? []).map(async stock => {
      const project = await api.projects.getProjectById({ projectId: stock.id })
      return {
        ...stock,
        project: {
          projectName: project?.projectName ?? "Loading...",
          projectStockPrice: project?.projectStockPrice ?? 0,
          projectStockProfits: project?.projectStockProfits ?? 0,
          projectProfitsCollectDate: project?.projectProfitsCollectDate ?? new Date(),
        },
      }
    }),
  )

  // Convert user stocks to StockMetrics format for the chart
  const stockMetrics: StockMetrics[] = stocksWithProjects.map(stock => ({
    stockId: stock.id,
    purchaseDate: stock.createdAt,
    profitCollectDate: stock.project.projectProfitsCollectDate,
    numberOfStocks: stock.stocks,
    stockPrice: stock.project.projectStockPrice,
    profitPerStock: stock.project.projectStockProfits,
    specialPercentage: stock.newPercentage,
  }))

  // Find the earliest purchase date and latest profit collection date
  const dates = stockMetrics.reduce(
    (acc, stock) => {
      if (stock.purchaseDate < acc.startDate) {
        acc.startDate = stock.purchaseDate
      }
      if (stock.profitCollectDate > acc.endDate) {
        acc.endDate = stock.profitCollectDate
      }
      return acc
    },
    {
      startDate: new Date(),
      endDate: new Date(0),
    },
  )

  // Calculate investment metrics for the chart
  const investmentData = calculateInvestmentMetrics(stockMetrics, dates.startDate, dates.endDate)

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 grid-rows-[auto_1fr] gap-x-0 gap-y-4 md:gap-4 select-none px-2 md:px-9 pt-14">
      <Card className="w-full col-span-1 flex flex-col justify-between">
        <CardHeader className="text-center">
          <CardTitle>رصيد الحساب</CardTitle>
          <CardDescription>رصيدك الحالي القابل للسحب</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mx-auto h-fit w-fit">
            <Metric amount={user?.credits ?? 0} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href={"/dashboard/withdrawals"} className="pressable w-full">
            سحب الرصيد
          </Link>
        </CardFooter>
      </Card>

      <div className="w-full col-span-2">
        {!user?.stocks?.length ? (
          <Card>
            <CardHeader>
              <CardTitle>الأسهم الخاصة بي</CardTitle>
              <CardDescription>
                لا توجد أسهم لعرض الربح، يرجى التوجه إلى صفحة إدارة الأسهم لتحميل الأسهم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NoRecords msg="لا توجد أسهم لعرض الربح" className="max-h-40 max-w-40" />
            </CardContent>
          </Card>
        ) : (
          <InvestmentChart data={investmentData} profitCollectDate={dates.endDate} />
        )}
      </div>

      <div className="col-span-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>الأسهم الخاصة بي</CardTitle>
            <CardDescription>جميع الأسهم التي تمتلكها في المشاريع الزراعية</CardDescription>
          </CardHeader>
          <CardContent>
            <UserStocksTable stocks={stocksWithProjects} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

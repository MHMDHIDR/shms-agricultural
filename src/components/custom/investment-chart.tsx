"use client"

import { TrendingUp } from "lucide-react"
import * as React from "react"
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  calculateDynamicTimeRanges,
  getDateRangeFromPeriod,
} from "@/lib/calculate-investment-metrics"
import { APP_CURRENCY } from "@/lib/constants"
import type { InvestmentDataPoint } from "@/lib/calculate-investment-metrics"

const baseChartConfig = {
  total: {
    label: "إجمالي القيمة",
    color: "hsl(var(--chart-1))",
  },
  base: {
    label: "رأس المال",
    color: "hsl(var(--chart-2))",
  },
  profit: {
    label: "الأرباح",
    color: "hsl(var(--chart-3))",
  },
} as const

type InvestmentChartProps = {
  data: InvestmentDataPoint[]
  profitCollectDate: Date
  MAX_POINTS?: number
}

type TooltipData = {
  name: string
  value: number
  color: string
  label: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; stroke: string; dataKey: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  const date = new Date(label ?? "")
  const tooltipData: TooltipData[] = []

  // Process total value
  const totalItem = payload.find(p => p.dataKey === "totalValue")
  if (totalItem) {
    tooltipData.push({
      name: "total",
      value: totalItem.value,
      color: totalItem.stroke,
      label: "إجمالي القيمة",
    })
  }

  // Process individual stock values
  payload.forEach(item => {
    if (item.dataKey.startsWith("stocks[")) {
      tooltipData.push({
        name: item.name,
        value: item.value,
        color: item.stroke,
        label: `ربح ${item.name}`,
      })
    }
  })

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-muted-foreground">
            {date.toLocaleDateString("ar-QA", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="grid gap-1">
          {tooltipData.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">{item.label}</span>
              </div>
              <span className="text-sm font-medium">
                {item.value.toLocaleString("ar-QA")} {APP_CURRENCY}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Function to reduce data points based on available width
function reduceDataPoints(data: InvestmentDataPoint[], MAX_POINTS = 7): InvestmentDataPoint[] {
  if (!data.length) return []
  if (data.length <= MAX_POINTS) return data // If we have MAX_POINTS or fewer points, show all

  // Calculate step size to show approximately MAX_POINTS points
  const targetPoints = MAX_POINTS
  const step = Math.max(1, Math.floor(data.length / targetPoints))
  const result: InvestmentDataPoint[] = []

  // Always include first point
  const firstPoint = data[0]
  if (firstPoint) {
    result.push(firstPoint)
  }

  // Add just a few evenly spaced points
  for (let i = step; i < data.length - step; i += step) {
    const point = data[i]
    if (point) {
      result.push(point)
    }
    // Break if we have enough points
    if (result.length >= targetPoints - 1) break
  }

  // Always include last point
  const lastPoint = data[data.length - 1]
  if (lastPoint && result[result.length - 1] !== lastPoint) {
    result.push(lastPoint)
  }

  return result
}

export function InvestmentChart({ data, profitCollectDate, MAX_POINTS = 7 }: InvestmentChartProps) {
  // Find the earliest date in the data
  const startDate = React.useMemo(() => {
    const dates = data.map(item => new Date(item.date))
    return new Date(Math.min(...dates.map(date => date.getTime())))
  }, [data])

  // Calculate available time ranges
  const timeRanges = React.useMemo(
    () => calculateDynamicTimeRanges(startDate, profitCollectDate),
    [startDate, profitCollectDate],
  )

  // Set initial time range to the shortest available option
  const [timeRange, setTimeRange] = React.useState(timeRanges[0]?.value ?? "all")

  const { startDate: filterStartDate, endDate: filterEndDate } = React.useMemo(
    () => getDateRangeFromPeriod(timeRange, profitCollectDate),
    [timeRange, profitCollectDate],
  )

  // Add a ref for the container
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Filter and reduce data points
  const filteredData = React.useMemo(() => {
    const timeFilteredData = data.filter(item => {
      const date = new Date(item.date)
      return date >= filterStartDate && date <= filterEndDate
    })
    return reduceDataPoints(timeFilteredData, MAX_POINTS)
  }, [data, filterStartDate, filterEndDate, MAX_POINTS])

  // Calculate growth percentage
  const growthPercentage = React.useMemo(() => {
    if (filteredData.length < 2) return 0
    const firstValue = filteredData[0]?.totalValue ?? 0
    const lastValue = filteredData[filteredData.length - 1]?.totalValue ?? 0
    return ((lastValue - firstValue) / firstValue) * 100
  }, [filteredData])

  // Generate dynamic chart config including individual stock lines
  const chartConfig = React.useMemo(() => {
    const config = { ...baseChartConfig } as Record<string, { label: string; color: string }>
    const firstDataPoint = data[0]

    if (firstDataPoint?.stocks) {
      firstDataPoint.stocks.forEach((stock, index) => {
        config[`stock${index}`] = {
          label: stock.label,
          color: `hsl(${200 + index * 30}deg 70% 50%)`,
        }
      })
    }

    return config
  }, [data])

  const firstDate = filteredData[0]?.date
  const lastDate = filteredData[filteredData.length - 1]?.date

  return (
    <Card>
      <CardHeader className="flex items-center gap-1.5 space-y-0 border-b py-4 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-right">
          <CardTitle>تحليل الاستثمار</CardTitle>
          <CardDescription>عرض نمو الاستثمار على مدار الفترة المحددة</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-full md:w-fit px-3 rounded-lg rtl sm:mr-auto cursor-pointer"
            aria-label="اختر فترة زمنية"
          >
            <SelectValue placeholder={timeRanges[0]?.label} />
          </SelectTrigger>
          <SelectContent className="rounded-xl rtl">
            {timeRanges.map(range => (
              <SelectItem
                key={range.value}
                value={range.value}
                className="rounded-lg cursor-pointer"
              >
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-3 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          ref={containerRef}
          config={chartConfig}
          className="aspect-auto h-60 w-full overflow-x-auto"
        >
          <ResponsiveContainer width={Math.max(filteredData.length * 120, 100)} height="100%">
            <LineChart data={filteredData} margin={{ top: 20, right: 25, left: 10, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={30}
                interval={0}
                tickFormatter={(value: string) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("ar-QA", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={50}
                tickCount={5}
                tickFormatter={(value: number) =>
                  `${value.toLocaleString("ar-QA")} ${APP_CURRENCY}`
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              />
              {/* Individual stock lines */}
              {filteredData[0]?.stocks.map((_, index) => (
                <Line
                  key={`stock${index}`}
                  type="monotone"
                  dataKey={`stocks[${index}].value`}
                  name={`استثمار ${index + 1}`}
                  stroke={`var(--color-stock${index})`}
                  strokeWidth={1.5}
                  dot={{
                    fill: `var(--color-stock${index})`,
                    r: 4,
                    strokeWidth: 1,
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 8,
                    fill: `var(--color-stock${index})`,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              ))}
              {/* Total value line */}
              <Line
                type="monotone"
                dataKey="totalValue"
                name="إجمالي القيمة"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-total)",
                  r: 4,
                  strokeWidth: 1,
                  stroke: "#fff",
                }}
                activeDot={{
                  r: 8,
                  fill: "var(--color-total)",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => `${value.toLocaleString("ar-QA")} ${APP_CURRENCY}`}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {growthPercentage > 0 ? "ارتفاع" : "انخفاض"} بنسبة {Math.abs(growthPercentage).toFixed(1)}
          % خلال هذه الفترة{" "}
          <TrendingUp
            className={`h-4 w-4 ${growthPercentage >= 0 ? "text-green-500" : "text-red-500"}`}
          />
        </div>
        <div className="leading-none text-muted-foreground">
          {firstDate && lastDate ? (
            <>
              عرض تطور مستمر للاستثمار من {new Date(firstDate).toLocaleDateString("ar-QA")} إلى{" "}
              {new Date(lastDate).toLocaleDateString("ar-QA")}
            </>
          ) : (
            "لا توجد بيانات متاحة"
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

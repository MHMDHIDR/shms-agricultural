import * as React from "react"
import { Legend, Tooltip } from "recharts"
import { cn } from "@/lib/utils"
import type { ContentType } from "recharts/types/component/Tooltip"

export type ChartConfig = Record<
  string,
  {
    label: string
    color: string
  }
>

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  ref?: React.RefObject<HTMLDivElement>
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, children, className, ...props }, ref) => {
    const cssVars = React.useMemo(() => {
      const vars: Record<string, string> = {}
      Object.entries(config).forEach(([key, value]) => {
        vars[`--color-${key}`] = value.color
      })
      return vars
    }, [config])

    return (
      <div ref={ref} className={cn("relative", className)} style={cssVars} {...props}>
        {children}
      </div>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

interface ChartTooltipProps {
  content: ContentType<number, string>
  cursor?: boolean | object
  isAnimationActive?: boolean
  wrapperStyle?: React.CSSProperties
  trigger?: "hover" | "click"
  allowEscapeViewBox?: { x: boolean; y: boolean }
  position?: { x: number; y: number }
}

export function ChartTooltip({
  content,
  cursor,
  isAnimationActive,
  wrapperStyle,
  ...props
}: ChartTooltipProps) {
  return (
    <Tooltip
      content={content}
      cursor={cursor ?? { stroke: "hsl(var(--muted))", strokeWidth: 1 }}
      isAnimationActive={isAnimationActive}
      wrapperStyle={wrapperStyle}
      {...props}
    />
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
  labelFormatter: (label: string) => string
  valueFormatter: (value: number) => string
  indicator?: "line" | "dot"
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  indicator = "line",
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-muted-foreground">
            {labelFormatter(label ?? "")}
          </div>
        </div>
        <div className="grid gap-1">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {indicator === "line" ? (
                <div className="h-px w-3" style={{ backgroundColor: item.color }} />
              ) : (
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              )}
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{valueFormatter(item.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ChartLegendProps {
  content: React.ReactNode
  verticalAlign?: "top" | "middle" | "bottom"
  height?: number
}

export function ChartLegend({ content, verticalAlign = "top", height = 60 }: ChartLegendProps) {
  return <Legend content={() => content} verticalAlign={verticalAlign} height={height} />
}

interface ChartLegendContentProps {
  payload?: Array<{
    value: string
    color: string
  }>
}

export function ChartLegendContent({ payload }: ChartLegendContentProps) {
  return (
    <div className="flex items-center justify-center gap-8">
      {payload?.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-sm font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

"use client"

import { LoadingCard } from "@/components/custom/loading"
import { cn } from "@/lib/utils"

interface TableLoadingStateProps {
  /**
   * Number of rows to show in the loading state
   * @default 8
   */
  rows?: number

  /**
   * Height of each row
   * @default "h-16"
   */
  rowHeight?: string

  /**
   * Additional className for the container
   */
  className?: string
}

/**
 * A component to show a loading state for tables
 */
export function TableLoadingState({
  rows = 8,
  rowHeight = "h-16",
  className,
}: TableLoadingStateProps) {
  return (
    <div className={cn("rounded-md border p-4", className)}>
      <LoadingCard renderedSkeletons={rows} layout="vertical" className={rowHeight} />
    </div>
  )
}

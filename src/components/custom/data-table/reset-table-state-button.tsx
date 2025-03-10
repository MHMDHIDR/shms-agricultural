"use client"

import { RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { clearPersistedTableState } from "@/hooks/use-persisted-table-state"
import type { ButtonProps } from "@/components/ui/button"
import type { Table } from "@tanstack/react-table"

interface ResetTableStateButtonProps<TData> extends ButtonProps {
  /**
   * The table ID used for localStorage persistence
   */
  tableId: string

  /**
   * Optional table instance to reset programmatically
   */
  table?: Table<TData>

  /**
   * Optional callback to run after resetting
   */
  onReset?: () => void

  /**
   * Button text
   * @default "Reset Table"
   */
  children?: React.ReactNode

  /**
   * Whether to refresh the page after reset
   * @default false
   */
  refreshAfterReset?: boolean
}

/**
 * A button component that resets persisted table state to default
 */
export function ResetTableStateButton<TData>({
  tableId,
  table,
  onReset,
  children = "إعادة ضبط الجدول",
  refreshAfterReset = false,
  ...props
}: ResetTableStateButtonProps<TData>) {
  const router = useRouter()
  const [isResetting, setIsResetting] = useState(false)

  const handleReset = () => {
    setIsResetting(true)

    // Clear persisted state from localStorage
    clearPersistedTableState(tableId)

    // Reset table state programmatically if table instance is provided
    if (table) {
      table.resetColumnVisibility()
      table.resetColumnFilters()
      table.resetSorting()
      table.resetPagination()
    }

    // Call optional callback
    onReset?.()

    // If refresh is requested, use Next.js router to refresh the page
    // This is better than window.location.reload() as it preserves the React state
    if (refreshAfterReset) {
      // Small timeout to ensure localStorage is cleared before refresh
      setTimeout(() => {
        router.refresh()
        setIsResetting(false)
      }, 100)
    } else {
      setIsResetting(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReset}
      className="flex items-center gap-1 cursor-pointer"
      disabled={isResetting}
      {...props}
    >
      <RefreshCcw className={`h-3.5 w-3.5 ${isResetting ? "animate-spin" : ""}`} />
      {isResetting ? "جاري إعادة الضبط..." : children}
    </Button>
  )
}

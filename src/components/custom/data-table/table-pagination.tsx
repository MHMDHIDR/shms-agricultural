import { Button } from "@/components/ui/button"
import type { SharedColumnsProps } from "@/hooks/use-shared-columns"
import type { Table } from "@tanstack/react-table"

type TablePaginationProps<TData> = {
  table: Table<TData>
  selectedRows: TData[]
  isSelectable?: boolean
  entityType?: SharedColumnsProps["entityType"]
}

export function TablePagination<TData>({
  table,
  selectedRows,
  isSelectable = true,
  entityType,
}: TablePaginationProps<TData>) {
  return (
    <div className="flex select-none items-center justify-start gap-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="cursor-pointer"
      >
        السابق
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="cursor-pointer"
      >
        التالي
      </Button>

      {isSelectable && entityType !== "investors" && (
        <div className="text-muted-foreground text-sm">
          تم تحديد {selectedRows.length} من {table.getFilteredRowModel().rows.length}
        </div>
      )}
    </div>
  )
}

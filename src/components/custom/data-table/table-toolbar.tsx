import { ChevronDown, SettingsIcon, X } from "lucide-react"
import { useMemo, useState } from "react"
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog"
import { DataTableFacetedFilter } from "@/components/custom/data-table/data-table-faceted-filter"
import { ResetTableStateButton } from "@/components/custom/data-table/reset-table-state-button"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { translateSring } from "@/lib/translate-string"
import type { DataTableFilterField } from "@/components/custom/data-table/data-table-faceted-filter"
import type { ButtonProps } from "@/components/ui/button"
import type { Table } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"

export type BulkAction = {
  label: string
  onClick: () => void
  icon: LucideIcon
  variant?: ButtonProps["variant"]
  confirmationTitle?: string
  confirmationDescription?: string
  confirmationButtonText?: string
  confirmationButtonClass?: string
}

type TableToolbarProps<TData> = {
  table: Table<TData>
  filtering: string
  setFiltering: (value: string) => void
  selectedRows: TData[]
  bulkActions?: BulkAction[]
  searchPlaceholder?: string
  filterFields?: DataTableFilterField[]
  /**
   * Optional table ID for localStorage persistence
   * If provided, a reset button will be shown
   */
  tableId?: string
  onReset?: () => void
}

export function TableToolbar<TData>({
  table,
  filtering,
  setFiltering,
  selectedRows,
  bulkActions = [],
  searchPlaceholder = "Search...",
  filterFields = [],
  tableId,
  onReset,
}: TableToolbarProps<TData>) {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<BulkAction | null>(null)

  const hasBulkActions = bulkActions.length > 0

  const isFiltered = table.getState().columnFilters.length > 0

  const { filterableColumns } = useMemo(() => {
    return { filterableColumns: filterFields.filter(field => field.options) }
  }, [filterFields])

  const handleActionClick = (action: BulkAction) => {
    if (action.confirmationTitle) {
      setSelectedAction(action)
      setConfirmationDialogOpen(true)
    } else {
      action.onClick()
    }
  }

  return (
    <>
      <div className="flex select-none w-full flex-col gap-2 py-2.5 sm:flex-row">
        <Input
          placeholder={searchPlaceholder || "إبحث عن بيانات ..."}
          value={filtering}
          onChange={event => setFiltering(event.target.value)}
          className="rtl w-full md:max-w-xs"
        />
        <div className="flex flex-wrap items-center gap-2">
          {selectedRows.length > 0 && hasBulkActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="cursor-pointer">
                  <SettingsIcon className="h-3 w-3" />
                  إجراءات
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="space-y-1">
                <DropdownMenuLabel className="text-center">إجراءات إضافية</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {bulkActions.map((action, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <Button
                      className="w-full cursor-pointer justify-end"
                      variant={action.variant ?? "default"}
                      size="sm"
                      onClick={() => handleActionClick(action)}
                    >
                      {action.label}
                      <action.icon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {filterableColumns.map(
            column =>
              table.getColumn(column.id) && (
                <DataTableFacetedFilter
                  key={column.id}
                  column={table.getColumn(column.id)}
                  title={column.label}
                  options={column.options ?? []}
                />
              ),
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 cursor-pointer px-2 lg:px-3"
            >
              إلغاء الفلترة
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-auto cursor-pointer">
                <ChevronDown className="mr-2 h-4 w-4" />
                الأعمدة
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" avoidCollisions={false}>
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                    onSelect={e => e.preventDefault()}
                    dir="auto"
                  >
                    {translateSring(column.id)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {tableId && (
            <ResetTableStateButton
              tableId={tableId}
              table={table}
              onReset={onReset}
              refreshAfterReset={true}
            />
          )}
        </div>
      </div>

      {selectedAction && (
        <ConfirmationDialog
          open={confirmationDialogOpen}
          onOpenChange={setConfirmationDialogOpen}
          title={selectedAction.confirmationTitle ?? "تأكيد العملية"}
          description={
            selectedAction.confirmationDescription ?? "هل أنت متأكد من تنفيذ هذه العملية؟"
          }
          buttonText={selectedAction.confirmationButtonText ?? "تأكيد"}
          buttonClass={selectedAction.confirmationButtonClass ?? ""}
          onConfirm={async () => {
            selectedAction.onClick()
            setConfirmationDialogOpen(false)
            setSelectedAction(null)
          }}
        />
      )}
    </>
  )
}

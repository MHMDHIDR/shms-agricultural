"use client"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import clsx from "clsx"
import { Ban, CheckCircle, RotateCcw, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TableLoadingState } from "@/components/custom/data-table/table-loading-state"
import { TablePagination } from "@/components/custom/data-table/table-pagination"
import { TableToolbar } from "@/components/custom/data-table/table-toolbar"
import NoRecords from "@/components/custom/no-records"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { usePersistedTableState } from "@/hooks/use-persisted-table-state"
import { useSharedColumns } from "@/hooks/use-shared-columns"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/trpc/react"
import type { BulkAction } from "@/components/custom/data-table/table-toolbar"
import type { withdraw_actions } from "@prisma/client"

export default function OperationsClientPage({
  operations,
  count,
}: {
  operations: withdraw_actions[]
  count: number
}) {
  // Client-side only flag to prevent hydration mismatches
  const [isClient, setIsClient] = useState(false)

  // Use the persisted table state hook
  const {
    sorting,
    columnFilters,
    columnVisibility,
    pagination,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setPagination,
    isLoading,
  } = usePersistedTableState("operations-table")

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const toast = useToast()
  const utils = api.useUtils()
  const router = useRouter()

  const handleBulkDeleteOperations = api.operations.bulkDelete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف العمليات بنجاح")
      void utils.operations.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء حذف العمليات")
    },
    onMutate: () => {
      toast.loading("جاري حذف العمليات ...")
    },
  })

  const handleBulkUpdateOperationStatus = api.operations.updateOperationStatus.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث حالة العمليات بنجاح")
      void utils.operations.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء تحديث حالة العمليات")
    },
    onMutate: () => {
      toast.loading("جاري تحديث حالة العمليات ...")
    },
  })

  const handleDeleteOperation = (id: string) => {
    handleBulkDeleteOperations.mutate({ operationIds: [id] })
  }

  const handleUpdateOperationStatus = (
    id: string,
    status: withdraw_actions["accounting_operation_status"],
  ) => {
    handleBulkUpdateOperationStatus.mutate({ ids: [id], status })
  }

  const { columns, filterFields } = useSharedColumns<withdraw_actions>({
    entityType: "withdraw_actions",
    actions: {
      onDelete: handleDeleteOperation,
      onUpdate: handleUpdateOperationStatus,
      basePath: "/operations",
    },
  })

  const table = useReactTable<withdraw_actions>({
    data: operations,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    enableColumnPinning: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
      globalFilter,
      columnPinning: { right: ["actions"] },
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)

  const getBulkActions = (): BulkAction[] => {
    const actions: BulkAction[] = [
      {
        label: "حذف المحدد",
        onClick: () => {
          const operationIds = selectedRows.map(row => row.id)
          handleBulkDeleteOperations.mutate({ operationIds })
        },
        variant: "destructive",
        icon: Trash,
      },
    ]

    // Get unique statuses of selected operations
    const selectedStatuses = new Set(selectedRows.map(row => row.accounting_operation_status))

    // Only show "pending" option if not all selected operations are already pending
    if (!selectedStatuses.has("pending") || selectedStatuses.size > 1) {
      actions.push({
        label: "معلق",
        onClick: () => {
          const operationIds = selectedRows.map(row => row.id)
          handleBulkUpdateOperationStatus.mutate({
            ids: operationIds,
            status: "pending",
          })
        },
        variant: "outline",
        icon: RotateCcw,
      })
    }

    // Only show "completed" option if not all selected operations are already completed
    if (!selectedStatuses.has("completed") || selectedStatuses.size > 1) {
      actions.push({
        label: "مكتمل",
        onClick: () => {
          const operationIds = selectedRows.map(row => row.id)
          handleBulkUpdateOperationStatus.mutate({
            ids: operationIds,
            status: "completed",
          })
        },
        variant: "default",
        icon: CheckCircle,
      })
    }

    // Only show "rejected" option if not all selected operations are already rejected
    if (!selectedStatuses.has("rejected") || selectedStatuses.size > 1) {
      actions.push({
        label: "مرفوض",
        onClick: () => {
          const operationIds = selectedRows.map(row => row.id)
          handleBulkUpdateOperationStatus.mutate({
            ids: operationIds,
            status: "rejected",
          })
        },
        variant: "destructive",
        icon: Ban,
      })
    }

    return actions
  }

  if (!operations || count === 0) {
    return <NoRecords msg="لم يتم العثور على أي عمليات مالية في الوقت الحالي" />
  }

  // Show a loading state if we're still on the server or loading from localStorage
  const showLoading = !isClient || isLoading

  return (
    <div className="space-y-4">
      <TableToolbar<withdraw_actions>
        table={table}
        filtering={globalFilter}
        setFiltering={setGlobalFilter}
        selectedRows={selectedRows}
        searchPlaceholder="ابحث عن عملية"
        bulkActions={getBulkActions()}
        filterFields={filterFields}
        tableId="operations-table"
      />

      <TablePagination table={table} selectedRows={selectedRows} />

      {showLoading ? (
        <TableLoadingState rows={10} />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="select-none">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    const isPinned = header.column.getIsPinned()
                    return (
                      <TableHead
                        key={header.id}
                        className={clsx(
                          "text-center",
                          isPinned && "sticky left-0 bg-background shadow-[1px_0_0_0_#e5e7eb]",
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map(cell => {
                      const isPinned = cell.column.getIsPinned()
                      return (
                        <TableCell
                          key={cell.id}
                          className={clsx(
                            "text-center",
                            isPinned && "sticky left-0 bg-background shadow-[1px_0_0_0_#e5e7eb]",
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    لم يتم العثور على نتائج
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <TablePagination table={table} selectedRows={selectedRows} />
    </div>
  )
}

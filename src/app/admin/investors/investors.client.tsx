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
import type { User } from "@prisma/client"

export default function InvestorsClientPage({
  investors,
  count,
}: {
  investors: User[]
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
  } = usePersistedTableState("investors-table")

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  const [globalFilter, setGlobalFilter] = useState("")

  const { columns, filterFields } = useSharedColumns<User>({
    entityType: "users",
    actions: { basePath: "/users" },
    showActions: false,
  })

  const table = useReactTable<User>({
    data: investors,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    enableColumnPinning: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      globalFilter,
      columnPinning: { right: ["actions"] },
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)

  if (!investors || count === 0) {
    return <NoRecords msg="لم يتم العثور على أي مستثمرين في الوقت الحالي" />
  }

  // Show a loading state if we're still on the server or loading from localStorage
  const showLoading = !isClient || isLoading

  return (
    <div className="space-y-4">
      <TableToolbar<User>
        table={table}
        filtering={globalFilter}
        setFiltering={setGlobalFilter}
        selectedRows={selectedRows}
        searchPlaceholder="ابحث عن مستثمر"
        filterFields={filterFields}
        tableId="investors-table"
      />

      <TablePagination table={table} entityType="investors" selectedRows={selectedRows} />

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
                            "text-center py-3",
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

      <TablePagination table={table} entityType="investors" selectedRows={selectedRows} />
    </div>
  )
}

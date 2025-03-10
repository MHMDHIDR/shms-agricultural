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
import { useState } from "react"
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
import { useSharedColumns } from "@/hooks/use-shared-columns"
import WithdrawNavigation from "./withdraw-navigation"
import type { withdraw_actions } from "@prisma/client"
import type { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table"

export default function WithdrawalsClient({ operations }: { operations: withdraw_actions[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const { columns, filterFields } = useSharedColumns<withdraw_actions>({
    entityType: "withdraw_actions",
    actions: { basePath: "/withdrawals" },
  })

  const table = useReactTable({
    data: operations,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    enableColumnPinning: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      columnPinning: { right: ["actions"] },
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original)

  return (
    <section className="flex select-none flex-col h-screen items-center md:items-baseline px-2 md:px-9 pt-14">
      <div className="w-full">
        <WithdrawNavigation />

        {!operations.length ? (
          <NoRecords msg="لم يتم العثور على أي عمليات سحب" />
        ) : (
          <div className="space-y-4">
            <TableToolbar
              table={table}
              filtering={globalFilter}
              setFiltering={setGlobalFilter}
              selectedRows={selectedRows}
              searchPlaceholder="ابحث في عمليات السحب..."
              filterFields={filterFields}
            />

            <div className="rounded-md border">
              <Table>
                <TableHeader>
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
                                "text-center whitespace-nowrap",
                                isPinned &&
                                  "sticky left-0 bg-background shadow-[1px_0_0_0_#e5e7eb]",
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
          </div>
        )}
      </div>
    </section>
  )
}

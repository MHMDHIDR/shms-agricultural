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
import type { Projects } from "@prisma/client"

export default function ProfitsPercentageTable({ projects }: { projects: Projects[] }) {
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
  } = usePersistedTableState("profits-percentage-table")

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  const toast = useToast()
  const router = useRouter()
  const utils = api.useUtils()

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const { mutate: deleteProfitsPercentage } = api.projects.deleteProfitsPercentage.useMutation({
    onMutate: () => {
      toast.loading("جاري حذف نسبة الربح...")
    },
    onSuccess: async () => {
      toast.success("تم حذف نسبة الربح بنجاح")
      await utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ ما")
    },
  })

  const projectsWithPercentage = projects.filter(project => project.projectSpecialPercentageCode)

  const { columns, filterFields } = useSharedColumns<Projects>({
    entityType: "profits_percentage",
    actions: {
      onDelete: (id: string) => {
        deleteProfitsPercentage({ projectId: id })
      },
      basePath: "/profits-percentage",
    },
  })

  const table = useReactTable<Projects>({
    data: projectsWithPercentage,
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

  if (projectsWithPercentage.length === 0) {
    return <NoRecords msg="لا توجد رموز زيادة نسبة الربح" />
  }

  // Show a loading state if we're still on the server or loading from localStorage
  const showLoading = !isClient || isLoading

  return (
    <div className="space-y-4">
      <TableToolbar<Projects>
        table={table}
        filtering={globalFilter}
        setFiltering={setGlobalFilter}
        selectedRows={selectedRows}
        searchPlaceholder="ابحث عن نسبة ربح"
        filterFields={filterFields}
        tableId="profits-percentage-table"
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

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
import { CircleCheck, CircleX, TrashIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TableLoadingState } from "@/components/custom/data-table/table-loading-state"
import { TablePagination } from "@/components/custom/data-table/table-pagination"
import { TableToolbar } from "@/components/custom/data-table/table-toolbar"
import NoRecords from "@/components/custom/no-records"
import { Button } from "@/components/ui/button"
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
import type { Projects } from "@prisma/client"

export default function ProjectsClientPage({
  projects,
  count,
}: {
  projects: Projects[]
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
  } = usePersistedTableState("projects-table")

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const toast = useToast()
  const utils = api.useUtils()
  const router = useRouter()

  const handleDeleteSingleProject = api.projects.deleteById.useMutation({
    onSuccess: () => {
      toast.success("تم حذف المشروع بنجاح")
      void utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء حذف المشروع")
    },
    onMutate: () => {
      toast.loading("جاري حذف المشروع ...")
    },
  })

  const handleDeleteManyProjects = api.projects.deleteManyById.useMutation({
    onSuccess: () => {
      toast.success("تم حذف المشاريع المحددة بنجاح")
      void utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء حذف المشاريع")
    },
    onMutate: () => {
      toast.loading("جاري حذف المشاريع ...")
    },
  })

  const handleActivateSingleProject = api.projects.update.useMutation({
    onSuccess: () => {
      toast.success("تم تفعيل المشروع بنجاح")
      void utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء تفعيل المشروع")
    },
    onMutate: () => {
      toast.loading("جاري تفعيل المشروع ...")
    },
  })

  const handleDeactivateSingleProject = api.projects.update.useMutation({
    onSuccess: () => {
      toast.success("تم تعطيل المشروع بنجاح")
      void utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء تعطيل المشروع")
    },
    onMutate: () => {
      toast.loading("جاري تعطيل المشروع ...")
    },
  })

  const handleTogglingProjectStudyCaseVisibility = api.projects.update.useMutation({
    onSuccess: () => {
      toast.success("تم تعديل حالة ظهور دراسة الجدوى بنجاح")
      void utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء تعديل حالة ظهور دراسة الجدوى")
    },
    onMutate: () => {
      toast.loading("جاري تعديل حالة ظهور دراسة الجدوى ...")
    },
  })

  const handleDepositMutation = api.projects.deposit.useMutation({
    onSuccess: data => {
      void utils.projects.getAll.invalidate()
      toast.success(data.message)
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء عملية الإيداع")
    },
    onMutate: () => {
      toast.loading("جاري تنفيذ العملية ...")
    },
  })

  const handleDepositCapitalCredits = (id: string) => {
    void handleDepositMutation.mutate({ projectId: id, depositType: "capital" })
  }

  const handleDepositProfitsCredits = (id: string) => {
    void handleDepositMutation.mutate({ projectId: id, depositType: "profits" })
  }

  const handleResetCredits = (id: string) => {
    void handleDepositMutation.mutate({ projectId: id, depositType: "reset" })
  }

  const handleDeleteProject = (id: string) => {
    void handleDeleteSingleProject.mutate({ id })
  }

  const handleToggleProjectStatus = (id: string, status: "active" | "pending") => {
    if (status === "active") {
      void handleActivateSingleProject.mutate({ id, projectStatus: "active" })
    } else {
      void handleDeactivateSingleProject.mutate({ id, projectStatus: "pending" })
    }
  }

  const handleToggleProjectStudyCaseVisibility = (id: string) => {
    void handleTogglingProjectStudyCaseVisibility.mutate({
      id,
      projectStudyCaseVisibility: !projects.find(project => project.id === id)
        ?.projectStudyCaseVisibility,
    })
  }

  const handleBulkUpdateProjects = api.projects.bulkUpdateProjects.useMutation({
    onSuccess: data => {
      toast.success(data.message)
      void utils.projects.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء تحديث المشاريع")
    },
    onMutate: () => {
      toast.loading("جاري تحديث المشاريع ...")
    },
  })

  const { columns, filterFields } = useSharedColumns<Projects>({
    entityType: "projects",
    actions: {
      onDelete: handleDeleteProject,
      onActivate: id => handleToggleProjectStatus(id, "active"),
      onDeactivate: id => handleToggleProjectStatus(id, "pending"),
      onToggleStudyCaseVisibility: id => handleToggleProjectStudyCaseVisibility(id),
      onDepositCapital: handleDepositCapitalCredits,
      onDepositProfits: handleDepositProfitsCredits,
      onResetCredits: handleResetCredits,
      basePath: "/projects",
    },
  })

  const table = useReactTable<Projects>({
    data: projects,
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

  // Define bulk actions
  const getBulkActions = (): BulkAction[] => {
    const actions: BulkAction[] = [
      {
        label: "حذف المحدد",
        onClick: () => {
          const projectIds = selectedRows.map(row => row.id)
          void handleDeleteManyProjects.mutate({ projectIds })
        },
        variant: "destructive",
        icon: TrashIcon,
        confirmationTitle: "تأكيد حذف المشاريع",
        confirmationDescription:
          "هل أنت متأكد من حذف المشاريع المحددين؟ لا يمكن التراجع عن هذه العملية.",
        confirmationButtonText: "حذف",
        confirmationButtonClass: "bg-red-500 hover:bg-red-600",
      },
    ]

    if (selectedRows.length > 0) {
      const hasPendingProjects = selectedRows.some(row => row.projectStatus === "pending")
      const hasActiveProjects = selectedRows.some(row => row.projectStatus === "active")

      if (hasPendingProjects) {
        actions.push({
          label: "تفعيل المحدد",
          onClick: () => {
            const projectIds = selectedRows.map(row => row.id)
            void handleBulkUpdateProjects.mutate({ projectIds, actionType: "active" })
          },
          variant: "success",
          icon: CircleCheck,
          confirmationTitle: "تأكيد تفعيل المشاريع",
          confirmationDescription: "هل أنت متأكد من تفعيل المشاريع المحددة؟",
          confirmationButtonText: "تفعيل",
          confirmationButtonClass: "bg-green-500 hover:bg-green-600",
        })
      }

      if (hasActiveProjects) {
        actions.push({
          label: "تعطيل المحدد",
          onClick: () => {
            const projectIds = selectedRows.map(row => row.id)
            void handleBulkUpdateProjects.mutate({ projectIds, actionType: "pending" })
          },
          variant: "success",
          icon: CircleX,
          confirmationTitle: "تأكيد تعطيل المشاريع",
          confirmationDescription: "هل أنت متأكد من تعطيل المشاريع المحددة؟",
          confirmationButtonText: "تعطيل",
          confirmationButtonClass: "bg-red-500 hover:bg-red-600",
        })
      }
    }

    return actions
  }

  if (!projects || count === 0) {
    return <NoRecords msg="لم يتم العثور على أي مشاريع في الوقت الحالي" />
  }

  // Show a loading state if we're still on the server or loading from localStorage
  const showLoading = !isClient || isLoading

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start">
        <Link href="/admin/projects/new">
          <Button variant={"pressable"}>مشروع جديد</Button>
        </Link>
      </div>

      <TableToolbar<Projects>
        table={table}
        filtering={globalFilter}
        setFiltering={setGlobalFilter}
        selectedRows={selectedRows}
        searchPlaceholder="ابحث عن مشروع"
        bulkActions={getBulkActions()}
        filterFields={filterFields}
        tableId="projects-table"
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

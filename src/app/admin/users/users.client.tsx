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
import {
  Ban,
  CircleCheck,
  CircleDollarSign,
  HandCoinsIcon,
  ListRestart,
  TrashIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TableLoadingState } from "@/components/custom/data-table/table-loading-state"
import { TablePagination } from "@/components/custom/data-table/table-pagination"
import { TableToolbar } from "@/components/custom/data-table/table-toolbar"
import { DepositDialog } from "@/components/custom/deposit-dialog"
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
import type { Projects, User } from "@prisma/client"

export default function UsersClientPage({
  users,
  count,
  projects,
}: {
  users: User[]
  count: number
  projects: Projects[]
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
  } = usePersistedTableState("users-table")

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false)
  const [currentDepositType, setCurrentDepositType] = useState<
    "capital" | "profits" | "reset" | null
  >(null)
  const toast = useToast()
  const utils = api.useUtils()
  const router = useRouter()

  const handleDeleteSingleUser = api.user.delete.useMutation({
    onSuccess: () => {
      toast.success("تم حذف المستخدم بنجاح")
      void utils.user.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء حذف المستخدم")
    },
    onMutate: () => {
      toast.loading("جاري حذف المستخدم ...")
    },
  })

  const handleBlockSingleUser = api.user.update.useMutation({
    onSuccess: () => {
      toast.success("تم حظر المستخدم بنجاح")
      void utils.user.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء حظر المستخدم")
    },
    onMutate: () => {
      toast.loading("جاري حظر المستخدم ...")
    },
  })

  const handleUnblockSingleUser = api.user.update.useMutation({
    onSuccess: () => {
      toast.success("تم إلغاء حظر المستخدم بنجاح")
      void utils.user.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء إلغاء حظر المستخدم")
    },
    onMutate: () => {
      toast.loading("جاري إلغاء حظر المستخدم ...")
    },
  })

  const handleBulkDepositForUsers = api.user.depositForUsers.useMutation({
    onSuccess: data => {
      toast.success(data.message)
      void utils.user.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء عملية الإيداع")
    },
    onMutate: () => {
      toast.loading("جاري تنفيذ العملية ...")
    },
  })

  const handleBulkUpdateUsers = api.user.bulkUpdateUsers.useMutation({
    onSuccess: data => {
      toast.success(data.message)
      void utils.user.getAll.invalidate()
      router.refresh()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ أثناء تنفيذ العملية")
    },
    onMutate: () => {
      toast.loading("جاري تنفيذ العملية ...")
    },
  })

  // Handle user actions
  const handleDeleteUser = (id: string) => {
    void handleDeleteSingleUser.mutate({ id })
  }

  const handleBlockUser = (id: string) => {
    void handleBlockSingleUser.mutate({ id, accountStatus: "block" })
  }

  const handleUnblockUser = (id: string) => {
    void handleUnblockSingleUser.mutate({ id, accountStatus: "active" })
  }

  const handleDepositDialogConfirm = (projectId: string) => {
    if (!currentDepositType) return

    const userIds = selectedRows.map(row => row.id)
    handleBulkDepositForUsers.mutate({
      userIds,
      projectId,
      depositType: currentDepositType,
    })
  }

  const openDepositDialog = (type: "capital" | "profits" | "reset") => {
    setCurrentDepositType(type)
    setIsDepositDialogOpen(true)
  }

  const { columns, filterFields } = useSharedColumns<User>({
    entityType: "users",
    actions: {
      onDelete: handleDeleteUser,
      onBlock: handleBlockUser,
      onUnblock: handleUnblockUser,
      basePath: "/users",
    },
  })

  const table = useReactTable<User>({
    data: users,
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
          const ids = selectedRows.map(row => row.id)
          handleBulkUpdateUsers.mutate({ userIds: ids, actionType: "delete" })
        },
        variant: "destructive",
        icon: TrashIcon,
        confirmationTitle: "تأكيد حذف المستخدمين",
        confirmationDescription:
          "هل أنت متأكد من حذف المستخدمين المحددين؟ لا يمكن التراجع عن هذه العملية.",
        confirmationButtonText: "حذف",
        confirmationButtonClass: "bg-red-500 hover:bg-red-600",
      },
    ]

    if (selectedRows.length > 0) {
      const hasBlockedUsers = selectedRows.some(row => row.accountStatus === "block")
      const hasActiveUsers = selectedRows.some(row => row.accountStatus === "active")

      if (hasActiveUsers) {
        actions.push({
          label: "حظر المحدد",
          onClick: () => {
            const ids = selectedRows.map(row => row.id)
            handleBulkUpdateUsers.mutate({ userIds: ids, actionType: "block" })
          },
          variant: "destructive",
          icon: Ban,
          confirmationTitle: "تأكيد حظر المستخدمين",
          confirmationDescription: "هل أنت متأكد من حظر المستخدمين المحددين؟",
          confirmationButtonText: "حظر",
          confirmationButtonClass: "bg-red-500 hover:bg-red-600",
        })
      }

      if (hasBlockedUsers) {
        actions.push({
          label: "إلغاء حظر المحدد",
          onClick: () => {
            const ids = selectedRows.map(row => row.id)
            handleBulkUpdateUsers.mutate({ userIds: ids, actionType: "unblock" })
          },
          variant: "success",
          icon: CircleCheck,
          confirmationTitle: "تأكيد إلغاء حظر المستخدمين",
          confirmationDescription: "هل أنت متأكد من إلغاء حظر المستخدمين المحددين؟",
          confirmationButtonText: "إلغاء الحظر",
          confirmationButtonClass: "bg-green-500 hover:bg-green-600",
        })
      }

      // Deposit actions
      actions.push(
        {
          label: "إيداع الأرباح",
          onClick: () => openDepositDialog("profits"),
          variant: "success",
          icon: HandCoinsIcon,
        },
        {
          label: "إيداع رأس المال",
          onClick: () => openDepositDialog("capital"),
          variant: "success",
          icon: CircleDollarSign,
        },
        {
          label: "تعيين الرصيد",
          onClick: () => openDepositDialog("reset"),
          variant: "destructive",
          icon: ListRestart,
          confirmationTitle: "تأكيد إعادة تعيين الرصيد",
          confirmationDescription:
            "هل أنت متأكد من إعادة تعيين الرصيد للمستخدمين المحددين؟ سيتم إزالة جميع الإيداعات السابقة.",
          confirmationButtonText: "إعادة تعيين",
          confirmationButtonClass: "bg-red-500 hover:bg-red-600",
        },
      )
    }

    return actions
  }

  if (!users || count === 0) {
    return <NoRecords msg="لم يتم العثور على أي مستخدمين في الوقت الحالي" />
  }

  // Show a loading state if we're still on the server or loading from localStorage
  const showLoading = !isClient || isLoading

  return (
    <>
      <div className="space-y-4">
        <TableToolbar<User>
          table={table}
          filtering={globalFilter}
          setFiltering={setGlobalFilter}
          selectedRows={selectedRows}
          searchPlaceholder="ابحث عن مستخدم"
          bulkActions={getBulkActions()}
          filterFields={filterFields}
          tableId="users-table"
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

      <DepositDialog
        projects={projects}
        open={isDepositDialogOpen}
        onOpenChange={setIsDepositDialogOpen}
        onConfirm={handleDepositDialogConfirm}
        title={
          currentDepositType === "profits"
            ? "إيداع الأرباح"
            : currentDepositType === "capital"
              ? "إيداع رأس المال"
              : "تعيين الرصيد"
        }
        description={
          currentDepositType === "profits"
            ? "اختر المشروع لإيداع الأرباح للمستخدمين المحددين"
            : currentDepositType === "capital"
              ? "اختر المشروع لإيداع رأس المال للمستخدمين المحددين"
              : "اختر المشروع لإعادة تعيين الرصيد للمستخدمين المحددين"
        }
        confirmText={
          currentDepositType === "profits"
            ? "تأكيد إيداع الأرباح"
            : currentDepositType === "capital"
              ? "إيداع رأس المال"
              : "تعيين الرصيد"
        }
      />
    </>
  )
}

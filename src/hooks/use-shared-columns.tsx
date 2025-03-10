import clsx from "clsx"
import {
  ArrowUpDown,
  Ban,
  CheckCircle,
  CircleDollarSign,
  Eye,
  HandCoins,
  ListRestart,
  MoreHorizontal,
  Pencil,
  ReceiptText,
  RotateCcw,
  Trash,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ConfirmationDialog } from "@/components/custom/confirmation-dialog"
import { CopyText } from "@/components/custom/copy"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { APP_CURRENCY } from "@/lib/constants"
import { formatDate } from "@/lib/format-date"
import { translateSring } from "@/lib/translate-string"
import { api } from "@/trpc/react"
import type { DataTableFilterField } from "@/components/custom/data-table/data-table-faceted-filter"
import type { Projects, User, withdraw_actions } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"

type BaseEntity = {
  id: string
  name?: string
  email?: string
}

type UserType = BaseEntity & User

type Project = BaseEntity & Projects

type WithdrawAction = BaseEntity & withdraw_actions

type UserStock = {
  id: string
  stocks: number
  newPercentage: number
  percentageCode: string
  createdAt: Date
  capitalDeposited: boolean
  profitsDeposited: boolean
  project: {
    projectName: string
    projectStockPrice: number
    projectStockProfits: number
    projectProfitsCollectDate: Date
  }
}

type TableActions = {
  onDelete?: (id: string) => void
  onUpdate?: (id: string, status: withdraw_actions["accounting_operation_status"]) => void
  onBlock?: (id: string) => void
  onUnblock?: (id: string) => void
  onActivate?: (id: string) => void
  onDeactivate?: (id: string) => void
  onToggleStudyCaseVisibility?: (id: string) => void
  onDepositCapital?: (id: string) => void
  onDepositProfits?: (id: string) => void
  onResetCredits?: (id: string) => void
  basePath:
    | "/users"
    | "/projects"
    | "/operations"
    | "/withdrawals"
    | "/profits-percentage"
    | "/dashboard"
}

export type SharedColumnsProps = {
  entityType:
    | "users"
    | "projects"
    | "withdraw_actions"
    | "profits_percentage"
    | "user_stocks"
    | "investors"
  actions: TableActions
  showActions?: boolean
}

// Add Row type for better type safety
type Row<T> = {
  original: T
  getIsSelected: () => boolean
  toggleSelected: (value: boolean) => void
}

function getDeleteDialogTitle(
  entityType: string,
  entity: BaseEntity & {
    projectName?: string
  },
) {
  switch (entityType) {
    case "users":
      return `هل أنت متأكد من حذف المستخدم ${entity.name}؟`
    case "projects":
      return `هل أنت متأكد من حذف المشروع ${entity.projectName}؟`
    case "withdraw_actions":
      return `هل أنت متأكد من حذف العملية رقم ${entity.id}؟`
    case "profits_percentage":
      return `هل أنت متأكد من حذف نسبة الربح للمشروع ${entity.projectName}؟`
    default:
      return "هل أنت متأكد من حذف هذا العنصر؟"
  }
}

function ActionCell<T extends BaseEntity>({
  row,
  entityType,
  actions,
}: {
  row: Row<
    T & {
      accountStatus?: string
      projectStatus?: string
      projectName?: string
      accounting_operation_status?: string
    }
  >
  entityType: SharedColumnsProps["entityType"]
  actions: TableActions
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDepositCapitalDialogOpen, setIsDepositCapitalDialogOpen] = useState(false)
  const [isDepositProfitsDialogOpen, setIsDepositProfitsDialogOpen] = useState(false)
  const [isResetCreditsDialogOpen, setIsResetCreditsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const entity = row.original

  const handleDelete = async () => {
    setIsDeleting(true)
    actions.onDelete?.(entity.id)
    setIsDeleting(false)
    setIsDeleteDialogOpen(false)
  }

  const handleStatusUpdate = (status: "pending" | "completed" | "rejected") => {
    actions.onUpdate?.(entity.id, status)
  }

  const handleDepositCapital = async () => {
    actions.onDepositCapital?.(entity.id)
    setIsDepositCapitalDialogOpen(false)
  }

  const handleDepositProfits = async () => {
    actions.onDepositProfits?.(entity.id)
    setIsDepositProfitsDialogOpen(false)
  }

  const handleResetCredits = async () => {
    actions.onResetCredits?.(entity.id)
    setIsResetCreditsDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
            <span className="sr-only">إفتح القائمة</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="rtl">
          <DropdownMenuLabel className="sr-only">{translateSring("actions")}</DropdownMenuLabel>
          {entityType === "withdraw_actions" && (
            <>
              {(row.original as unknown as WithdrawAction).accounting_operation_status !==
                "pending" && (
                <DropdownMenuItem onClick={() => handleStatusUpdate("pending")}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  معلق
                </DropdownMenuItem>
              )}
              {(row.original as unknown as WithdrawAction).accounting_operation_status !==
                "completed" && (
                <DropdownMenuItem onClick={() => handleStatusUpdate("completed")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  مكتمل
                </DropdownMenuItem>
              )}
              {(row.original as unknown as WithdrawAction).accounting_operation_status !==
                "rejected" && (
                <DropdownMenuItem onClick={() => handleStatusUpdate("rejected")}>
                  <Ban className="mr-2 h-4 w-4" />
                  مرفوض
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
            </>
          )}
          {entityType === "users" || entityType === "withdraw_actions" ? null : (
            <>
              <DropdownMenuItem asChild>
                <Link href={`/admin${actions.basePath}/${entity.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  تعديل
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {entityType === "users" && actions.onBlock && actions.onUnblock && (
            <DropdownMenuItem
              onClick={() =>
                (row.original as unknown as UserType).accountStatus === "block"
                  ? actions.onUnblock?.(entity.id)
                  : actions.onBlock?.(entity.id)
              }
              className="cursor-pointer"
            >
              <Ban className="mr-2 h-4 w-4" />
              {(row.original as unknown as UserType).accountStatus === "block"
                ? "الغاء حظر المستخدم"
                : "حظر المستخدم"}
            </DropdownMenuItem>
          )}
          {entityType === "projects" && actions.onActivate && actions.onDeactivate && (
            <DropdownMenuItem
              onClick={() =>
                (row.original as unknown as Project).projectStatus === "pending"
                  ? actions.onActivate?.(entity.id)
                  : actions.onDeactivate?.(entity.id)
              }
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {(row.original as unknown as Project).projectStatus === "pending" ? "تفعيل" : "تعطيل"}
            </DropdownMenuItem>
          )}
          {entityType === "projects" && actions.onToggleStudyCaseVisibility && (
            <DropdownMenuItem onClick={() => actions.onToggleStudyCaseVisibility?.(entity.id)}>
              <Eye className="mr-2 h-4 w-4" />
              {(row.original as unknown as Project).projectStudyCaseVisibility
                ? "إخفاء دراسة الجدوى"
                : "إظهار دراسة الجدوى"}
            </DropdownMenuItem>
          )}
          {entityType === "projects" && actions.onDepositCapital && (
            <DropdownMenuItem onClick={() => setIsDepositCapitalDialogOpen(true)}>
              <CircleDollarSign className="mr-2 h-4 w-4" />
              إيداع رأس المال
            </DropdownMenuItem>
          )}
          {entityType === "projects" && actions.onDepositProfits && (
            <DropdownMenuItem onClick={() => setIsDepositProfitsDialogOpen(true)}>
              <HandCoins className="mr-2 h-4 w-4" />
              إيداع الأرباح
            </DropdownMenuItem>
          )}
          {entityType === "projects" && actions.onResetCredits && (
            <DropdownMenuItem onClick={() => setIsResetCreditsDialogOpen(true)}>
              <ListRestart className="mr-2 h-4 w-4" />
              إعادة تعيين الرصيد
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={getDeleteDialogTitle(entityType, entity)}
        description="لا يمكن التراجع عن هذا الإجراء."
        buttonText={isDeleting ? "جاري الحذف..." : "حذف"}
        buttonClass="bg-destructive text-white hover:bg-destructive/90"
        onConfirm={handleDelete}
      />

      <ConfirmationDialog
        open={isDepositCapitalDialogOpen}
        onOpenChange={setIsDepositCapitalDialogOpen}
        title={`هل أنت متأكد من إيداع رأس المال للمشروع ${
          (entity as unknown as Project).projectName
        }؟`}
        description="سيتم إيداع رأس المال لجميع المستثمرين في هذا المشروع."
        buttonText="إيداع"
        buttonClass="bg-primary text-white hover:bg-primary/90"
        onConfirm={handleDepositCapital}
      />

      <ConfirmationDialog
        open={isDepositProfitsDialogOpen}
        onOpenChange={setIsDepositProfitsDialogOpen}
        title={`هل أنت متأكد من إيداع الأرباح للمشروع ${
          (entity as unknown as Project).projectName
        }؟`}
        description="سيتم إيداع الأرباح لجميع المستثمرين في هذا المشروع."
        buttonText="إيداع"
        buttonClass="bg-primary text-white hover:bg-primary/90"
        onConfirm={handleDepositProfits}
      />

      <ConfirmationDialog
        open={isResetCreditsDialogOpen}
        onOpenChange={setIsResetCreditsDialogOpen}
        title={`هل أنت متأكد من إعادة تعيين الرصيد للمشروع ${
          (entity as unknown as Project).projectName
        }؟`}
        description="سيتم إعادة تعيين الرصيد لجميع المستثمرين في هذا المشروع."
        buttonText="إعادة تعيين"
        buttonClass="bg-destructive text-white hover:bg-destructive/90"
        onConfirm={handleResetCredits}
      />
    </>
  )
}

export function useSharedColumns<T extends BaseEntity>({
  entityType,
  actions,
  showActions,
}: SharedColumnsProps): {
  columns: ColumnDef<T>[]
  filterFields: DataTableFilterField[]
} {
  const toast = useToast()
  const filterFields: DataTableFilterField[] = [
    ...(entityType === "users"
      ? [
          {
            id: "role",
            label: translateSring("role"),
            options: [
              { label: translateSring("admin"), value: "admin" },
              { label: translateSring("user"), value: "user" },
            ],
          },
          {
            id: "accountStatus",
            label: translateSring("status"),
            options: [
              { label: translateSring("active"), value: "active" },
              { label: translateSring("block"), value: "block" },
              { label: translateSring("pending"), value: "pending" },
            ],
          },
        ]
      : []),
    ...(entityType === "projects"
      ? [
          {
            id: "projectStatus",
            label: translateSring("projectStatus"),
            options: [
              {
                label: translateSring("Active".toLocaleLowerCase()),
                value: "active",
              },
              {
                label: translateSring("Pending".toLocaleLowerCase()),
                value: "pending",
              },
            ],
          },
        ]
      : []),
  ]

  const baseColumns: ColumnDef<T>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="cursor-pointer mx-3"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="cursor-pointer mx-3"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const userColumns: ColumnDef<T>[] = [
    {
      accessorKey: "sn",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("sn")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original as unknown as UserType
        return <span className="whitespace-nowrap">{user.sn}</span>
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("name")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original as unknown as UserType
        return <span className="whitespace-nowrap">{user.name}</span>
      },
    },
    {
      accessorKey: "stocks",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer whitespace-nowrap"
        >
          {translateSring("stocks")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const userStocks = (row.original as unknown as UserType).stocks
        const totalStocks = userStocks.reduce((acc, stock) => acc + stock.stocks, 0)

        return <span>{totalStocks}</span>
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("email")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("role")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original as unknown as UserType
        return (
          <span
            className={clsx("rounded-full border px-2.5 py-0.5 select-none", {
              "bg-green-50 text-green-600": user.role === "admin",
              "bg-blue-50 text-blue-600": user.role === "user",
            })}
          >
            {translateSring(user.role)}
          </span>
        )
      },
      filterFn: (row, _id, filterValues: string[]) => {
        const value = (row.original as unknown as UserType).role
        return filterValues.includes(value)
      },
    },
    {
      accessorKey: "accountStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("status")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original as unknown as UserType
        const isDeleted = user.isDeleted
        return (
          <span
            className={clsx("rounded-full border px-2.5 py-0.5 select-none", {
              "bg-green-50 text-green-600": user.accountStatus === "active",
              "bg-red-50 text-red-600": user.accountStatus === "block" || isDeleted,
              "bg-yellow-50 text-yellow-600": user.accountStatus === "pending",
            })}
          >
            {isDeleted ? translateSring("userDeleted") : translateSring(user.accountStatus)}
          </span>
        )
      },
      filterFn: (row, _id, filterValues: string[]) => {
        const value = (row.original as unknown as UserType).accountStatus
        return filterValues.includes(value)
      },
    },
  ]

  const projectColumns: ColumnDef<T>[] = [
    {
      accessorKey: "projectName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectName")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span className="whitespace-nowrap">{project.projectName}</span>
      },
    },
    {
      accessorKey: "projectStatus",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectStatus")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return (
          <span
            className={clsx("rounded-full whitespace-nowrap border px-2.5 py-0.5 select-none", {
              "bg-green-50 text-green-600": project.projectStatus === "active",
              "bg-yellow-50 text-yellow-600": project.projectStatus === "pending",
            })}
          >
            {translateSring(project.projectStatus)}
          </span>
        )
      },
      filterFn: (row, _id, filterValues: string[]) => {
        const value = (row.original as unknown as Project).projectStatus
        return filterValues.includes(value)
      },
    },
    {
      accessorKey: "projectStudyCaseVisibility",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectStudyCaseVisibility")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return (
          <span
            className={clsx("rounded-full border px-2.5 py-0.5 select-none", {
              "bg-green-50 text-green-600": project.projectStudyCaseVisibility,
              "bg-yellow-50 text-yellow-600": !project.projectStudyCaseVisibility,
            })}
          >
            {project.projectStudyCaseVisibility ? "معروض" : "مخفي"}
          </span>
        )
      },
    },
    {
      accessorKey: "projectLocation",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectLocation")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "projectAvailableStocks",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectAvailableStocks")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span>{project.projectAvailableStocks}</span>
      },
    },
    {
      accessorKey: "projectTotalStocks",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectTotalStocks")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span>{project.projectTotalStocks}</span>
      },
    },
    {
      accessorKey: "projectStockPrice",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectStockPrice")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span>{project.projectStockPrice}</span>
      },
    },
    {
      accessorKey: "projectSpecialPercentageCode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectSpecialPercentageCode")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return project.projectSpecialPercentageCode ? (
          <span>
            <CopyText
              text={project.projectSpecialPercentageCode ?? ""}
              className="ml-2 inline h-4 w-4"
            />
            {project.projectSpecialPercentageCode}
          </span>
        ) : (
          <Link href="/admin/profits-percentage">
            <Button variant={"pressable"} size={"sm"} className="text-xs">
              إضف نسبة زيادة ربح
            </Button>
          </Link>
        )
      },
    },
    {
      accessorKey: "projectSpecialPercentage",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectSpecialPercentage")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return project.projectSpecialPercentage ? (
          <span>{project.projectSpecialPercentage}%</span>
        ) : (
          <Link href="/admin/profits-percentage">
            <Button variant={"pressable"} size={"sm"} className="text-xs">
              إضف نسبة زيادة ربح
            </Button>
          </Link>
        )
      },
    },
    {
      accessorKey: "projectStartDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectStartDate")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        formatDate({
          date: String((row.original as unknown as Project).projectStartDate),
        }),
    },
    {
      accessorKey: "projectEndDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectEndDate")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        formatDate({
          date: String((row.original as unknown as Project).projectEndDate),
        }),
    },
    {
      accessorKey: "projectProfitsCollectDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectProfitsCollectDate")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        formatDate({
          date: String((row.original as unknown as Project).projectProfitsCollectDate),
        }),
    },
  ]

  const withdrawActionColumns: ColumnDef<T>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("id")} للعملية
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction
        return (
          <span className="whitespace-nowrap">
            <CopyText text={withdrawAction.id} className="ml-2 inline h-4 w-4" />
            {withdrawAction.id}
          </span>
        )
      },
    },
    {
      accessorKey: "sn",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("sn")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction & {
          user: Pick<UserType, "sn">
        }
        return (
          <span className="whitespace-nowrap">
            <CopyText text={withdrawAction.user.sn.toString()} className="ml-2 inline h-4 w-4" />
            {withdrawAction.user.sn}
          </span>
        )
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("name")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction & {
          user: Pick<UserType, "name">
        }

        return (
          <span className="whitespace-nowrap table-cell">
            <CopyText text={withdrawAction.user.name} className="ml-2 inline h-4 w-4" />
            {withdrawAction.user.name}
          </span>
        )
      },
    },
    {
      accessorKey: "withdraw_amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("amount")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction
        return (
          <strong className="text-primary">
            {withdrawAction.withdraw_amount} {APP_CURRENCY}
          </strong>
        )
      },
    },
    {
      accessorKey: "accounting_operation_status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("status")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction
        return (
          <span
            className={clsx("rounded-full border px-2.5 py-0.5 select-none whitespace-nowrap", {
              "bg-green-50 text-green-600":
                withdrawAction.accounting_operation_status === "completed",
              "bg-yellow-50 text-yellow-600":
                withdrawAction.accounting_operation_status === "pending",
              "bg-red-50 text-red-600": withdrawAction.accounting_operation_status === "rejected",
            })}
          >
            {translateSring(withdrawAction.accounting_operation_status)}
          </span>
        )
      },
    },
    {
      accessorKey: "action_type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("type")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction
        return <span>{translateSring(withdrawAction.action_type)}</span>
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("phone")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction & {
          user: Pick<UserType, "phone">
        }
        return (
          <Link
            href={`tel:${withdrawAction.user.phone}`}
            className="text-primary whitespace-nowrap"
          >
            {withdrawAction.user.phone}
          </Link>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("email")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction & {
          user: Pick<UserType, "email">
        }
        return (
          <Link
            href={`mailto:${withdrawAction.user.email}`}
            className="text-primary whitespace-nowrap"
          >
            {withdrawAction.user.email}
          </Link>
        )
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("address")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const withdrawAction = row.original as unknown as WithdrawAction & {
          user: Pick<UserType, "address">
        }
        return (
          <span className="whitespace-nowrap">
            <CopyText text={withdrawAction.user.address} className="ml-2 inline h-4 w-4" />
            {withdrawAction.user.address}
          </span>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("created_at")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        formatDate({
          date: String((row.original as unknown as WithdrawAction).created_at),
        }),
    },
  ]

  const profitsPercentageColumns: ColumnDef<T>[] = [
    {
      accessorKey: "projectName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectName")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span className="whitespace-nowrap">{project.projectName}</span>
      },
    },
    {
      accessorKey: "projectSpecialPercentageCode",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectSpecialPercentageCode")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return (
          <span>
            <CopyText
              text={project.projectSpecialPercentageCode ?? ""}
              className="ml-2 inline h-4 w-4"
            />
            {project.projectSpecialPercentageCode}
          </span>
        )
      },
    },
    {
      accessorKey: "projectSpecialPercentage",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("projectSpecialPercentage")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        return <span>{project.projectSpecialPercentage}%</span>
      },
    },
    {
      accessorKey: "projectStockProfits",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("currentProfits")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "newProfits",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          {translateSring("newProfits")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const project = row.original as unknown as Project
        const newProfits =
          project.projectStockProfits +
          (project.projectStockProfits * (project.projectSpecialPercentage ?? 0)) / 100
        return <span>{newProfits}</span>
      },
    },
  ]

  const userStocksColumns: ColumnDef<T>[] = [
    {
      accessorKey: translateSring("projectName"),
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          اسم المشروع
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.original as unknown as UserStock
        return <span className="whitespace-nowrap">{stock.project.projectName}</span>
      },
    },
    {
      accessorKey: "stocks",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          عدد الأسهم
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "stocksContract",
      header: () => (
        <Button variant="ghost" className="cursor-pointer">
          عقد شراء الأسهم
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.original as unknown as UserStock
        const sendContract = api.projects.sendPurchaseContract.useMutation({
          onSuccess: () => {
            toast.success("تم إرسال عقد شراء الأسهم إلى بريدك الإلكتروني")
          },
          onError: error => {
            toast.error(error.message ?? "حدث خطأ أثناء إرسال العقد")
          },
          onMutate: () => {
            toast.loading("جاري إرسال العقد إلى بريدك الإلكتروني...")
          },
        })

        const handleSendContract = () => {
          sendContract.mutate({
            projectId: stock.id,
            stocks: stock.stocks,
            newPercentage: stock.newPercentage,
            totalPayment: stock.stocks * stock.project.projectStockPrice,
            totalProfit:
              stock.project.projectStockProfits * stock.stocks * (1 + stock.newPercentage / 100),
            totalReturn:
              stock.stocks * stock.project.projectStockPrice +
              stock.project.projectStockProfits * stock.stocks * (1 + stock.newPercentage / 100),
            createdAt: stock.createdAt,
          })
        }

        return (
          <Button
            variant="pressable"
            className="cursor-pointer"
            onClick={handleSendContract}
            disabled={sendContract.isPending}
          >
            {sendContract.isPending ? "جاري الإرسال..." : "طلب عقد الشراء"}
            <ReceiptText className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "projectStockPrice",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          سعر السهم الواحد
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.original as unknown as UserStock
        return (
          <span>
            {stock.project.projectStockPrice} {APP_CURRENCY}
          </span>
        )
      },
    },
    {
      accessorKey: "totalPayment",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          إجمالي الدفع
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.original as unknown as UserStock
        return (
          <span>
            {stock.stocks * stock.project.projectStockPrice} {APP_CURRENCY}
          </span>
        )
      },
    },
    {
      accessorKey: "totalProfit",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          إجمالي الربح من الأسهم
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.original as unknown as UserStock
        const baseProfit = stock.project.projectStockProfits * stock.stocks
        const additionalProfit = baseProfit * (stock.newPercentage / 100)
        return (
          <span>
            {baseProfit + additionalProfit} {APP_CURRENCY}
          </span>
        )
      },
    },
    {
      accessorKey: "totalReturn",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          الإجمالي من ربح الأسهم ورأس المال
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.original as unknown as UserStock
        const totalPayment = stock.stocks * stock.project.projectStockPrice
        const baseProfit = stock.project.projectStockProfits * stock.stocks
        const additionalProfit = baseProfit * (stock.newPercentage / 100)
        return (
          <span>
            {totalPayment + baseProfit + additionalProfit} {APP_CURRENCY}
          </span>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          تاريخ الشراء
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.original as unknown as UserStock
        return formatDate({ date: stock.createdAt.toString() })
      },
    },
    {
      accessorKey: "projectProfitsCollectDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="cursor-pointer"
        >
          تاريخ تسليم الأرباح
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.original as unknown as UserStock
        return formatDate({ date: stock.project.projectProfitsCollectDate.toString() })
      },
    },
  ]

  const actionsColumn: ColumnDef<T> = {
    id: "actions",
    header: translateSring("actions"),
    enableHiding: false,
    enablePinning: true,
    enableSorting: false,
    meta: { pinned: "right" },
    cell: ({ row }) => (
      <ActionCell<T> row={row as Row<T>} entityType={entityType} actions={actions} />
    ),
  }

  return {
    columns: [
      ...(entityType === "investors" ? [] : baseColumns),
      ...(entityType === "users"
        ? [...userColumns, ...(showActions !== false ? [actionsColumn] : [])]
        : entityType === "projects"
          ? [...projectColumns, ...(showActions !== false ? [actionsColumn] : [])]
          : entityType === "withdraw_actions"
            ? [...withdrawActionColumns, ...(showActions !== false ? [actionsColumn] : [])]
            : entityType === "profits_percentage"
              ? [...profitsPercentageColumns, ...(showActions !== false ? [actionsColumn] : [])]
              : entityType === "user_stocks"
                ? [...userStocksColumns]
                : []),
    ] as ColumnDef<T>[],
    filterFields,
  }
}

'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { UserProps, accountingOperationsProps, stocksPurchasedProps } from '@/types'
import Copy from '@/components/custom/Copy'
import NoRecords from '@/components/custom/NoRecords'
import {
  cn,
  formattedPrice,
  getProjectDate,
  getProjectStatus,
  replaceString
} from '@/lib/utils'
import Link from 'next/link'
import OperationAction from '@/app/dashboard/money-operations/_OperationAction'
import { APP_LOGO } from '@/data/constants'
import Modal from '@/components/custom/Modal'
import UsersActions from '@/app/dashboard/users/_UsersActions'

export const columns: ColumnDef<accountingOperationsProps>[] = [
  {
    accessorKey: 'amount',
    header: () => <div className='text-right'>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)

      return <div className='text-right font-medium'>{formatted}</div>
    }
  }
]

export default function OperationsTable({
  data
}: {
  data: accountingOperationsProps[] | UserProps[] | any[]
}) {
  const dynamicColumns = data.length > 0 ? Object.keys(data[0]) : []

  const columns: ColumnDef<any>[] = dynamicColumns.map(column => ({
    accessorKey: column,
    header: column,
    cell: ({ row }) => <div>{row.getValue(column)}</div>
  }))

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns: columns, // Use the dynamically generated columns
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  const filteredColumns = [
    'shms_id',
    'shms_user_id',
    'shms_nationality',
    'shms_password',
    'shms_user_account_type',
    'shms_user_reset_token',
    'shms_user_reset_token_expires'
  ]

  return (
    <div className='w-full rtl'>
      <div className='flex items-center py-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              <ChevronDownIcon className='ml-2 h-4 w-4' />
              الأعمدة
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='rtl' avoidCollisions={false}>
            {table
              .getAllColumns()
              .filter(
                column => !filteredColumns.includes(column.id) && column.getCanHide()
              )
              .map(column => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={value => column.toggleVisibility(!!value)}
                  >
                    {replaceString(column.id)}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder='إبحــــث عن طريق الإســـــــم'
          defaultValue={table.getColumn('shms_fullname')?.getFilterValue() as string}
          onChange={event =>
            table.getColumn('shms_fullname')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers
                  .filter(header => !filteredColumns.includes(header.id))
                  .map(header => {
                    return (
                      <TableHead key={header.id} className={cn('min-w-56 text-center')}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              replaceString(String(header.column.columnDef.header)),
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                <TableHead>الإجـــــراء</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex: number) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row
                    .getVisibleCells()
                    .filter(cell => !filteredColumns.includes(cell.column.id))
                    .map(cell => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'min-w-56 text-center',
                          cell.getValue() === 'pending'
                            ? 'text-yellow-500'
                            : cell.getValue() === 'completed' ||
                              cell.getValue() === 'active'
                            ? 'text-green-500'
                            : cell.getValue() === 'rejected' ||
                              cell.getValue() === 'block'
                            ? 'text-red-500'
                            : cell.column.id.includes('shms_user_stocks') &&
                              !cell.getValue()
                            ? 'text-gray-400'
                            : 'text-black dark:text-white'
                        )}
                      >
                        {cell.column.id.includes('_id') ||
                        cell.column.id.includes('_sn') ? (
                          <span className='flex gap-x-3 justify-center items-center'>
                            <Copy
                              text={String(cell.getValue())}
                              className='inline ml-2 w-6 h-6'
                            />
                            <span className='font-bold'>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}{' '}
                            </span>
                          </span>
                        ) : cell.column.id.includes('accounting_operation_status') ||
                          cell.column.id.includes('shms_user_account_status') ||
                          cell.column.id.includes('shms_action_type') ? (
                          getProjectStatus(String(cell.getValue()))
                        ) : cell.column.id.includes('shms_created_at') ||
                          cell.column.id.includes('shms_date_of_birth') ? (
                          getProjectDate(new Date(String(cell.getValue())))
                        ) : cell.column.id.includes('shms_user_stocks') ? (
                          cell.getValue() === null ? (
                            'لم يتم شراء اي اسهم'
                          ) : (
                            JSON.parse(cell.getValue() as string).reduce(
                              (stock: number, acc: stocksPurchasedProps) =>
                                stock + acc.stocks,
                              0
                            )
                          )
                        ) : cell.column.id.includes('shms_withdraw_amount') ? (
                          formattedPrice(Number(cell.getValue()))
                        ) : cell.column.id.includes('shms_doc') ? (
                          <Modal
                            title={`صورة المستند`}
                            document={String(cell.getValue()) ?? APP_LOGO}
                            className='font-bold dark:text-white'
                          >
                            عرض المستند
                          </Modal>
                        ) : cell.column.id.includes('shms_phone') ? (
                          <Link
                            href={`tel:${String(cell.getValue())}`}
                            className='text-blue-500 transition-colors hover:font-bold hover:text-blue-700'
                          >
                            {String(cell.getValue())}
                          </Link>
                        ) : cell.column.id.includes('shms_withdraw_amount') ? (
                          formattedPrice(Number(cell.getValue()))
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </TableCell>
                    ))}
                  {row
                    .getVisibleCells()
                    // .filter(cell => !filteredColumns.includes(cell.column.id))
                    .map(cell => {
                      if (cell.id.includes('shms_withdraw_amount')) {
                        return (
                          <TableCell key={cell.id}>
                            <OperationAction withdrawAction={data[rowIndex]} />
                          </TableCell>
                        )
                      } else if (cell.id.includes('shms_id')) {
                        return (
                          <TableCell key={cell.id}>
                            <UsersActions
                              user={data as UserProps[]}
                              id={cell.getValue() as string}
                            />
                          </TableCell>
                        )
                      }
                    })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  <NoRecords msg='لم يتم العثور على بـيانـــــــــــات!' />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {/* يتم عرض {table.getFilteredRowModel().rows.length}
          {table.getFilteredRowModel().rows.length > 1 ? ' صفوف' : ' صف'} */}
        </div>
        <div className='flex gap-x-3'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            السابق
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            التالي
          </Button>
        </div>
      </div>
    </div>
  )
}

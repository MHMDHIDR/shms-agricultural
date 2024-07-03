'use client'

import { useState, useMemo, useEffect } from 'react'
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
import Copy from '@/components/custom/Copy'
import NoRecords from '@/components/custom/NoRecords'
import {
  cn,
  formattedPrice,
  getProjectDate,
  getProjectStatus,
  replaceString,
  saveColumnVisibility,
  loadColumnVisibility
} from '@/libs/utils'
import Link from 'next/link'
import OperationAction from '@/app/dashboard/money-operations/_OperationAction'
import { APP_LOGO } from '@/data/constants'
import Modal from '@/components/custom/Modal'
import UsersActions from '@/app/dashboard/users/_UsersActions'
import type { accountingOperationsProps } from '@/types'
import type { Users, Stocks } from '@prisma/client'

export default function OperationsTable({
  data
}: {
  data: accountingOperationsProps[] | Users[] | any[]
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
  const [filtering, setFiltering] = useState('')

  useEffect(() => {
    setColumnVisibility(() => loadColumnVisibility())
  }, [])

  useEffect(() => {
    saveColumnVisibility(columnVisibility)
  }, [columnVisibility])

  const table = useReactTable({
    data: useMemo(() => data, []),
    columns: useMemo(() => columns, []),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setFiltering,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filtering
    }
  })

  // Filter out columns that we don't want to show in the UI
  const filteredColumns = [
    'id',
    'shms_nationality',
    'shms_password',
    'shms_user_account_type',
    'shms_user_reset_token',
    'shms_user_reset_token_expires',
    'message',
    'loggedIn',
    'userAdded',
    'userUpdated',
    'userActivated',
    'userWithdrawnBalance',
    'forgotPassSent',
    'newPassSet',
    'resetEmail',
    'userDeleted'
  ]

  return (
    <div className='w-full rtl'>
      <div className='flex items-center py-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              <ChevronDownIcon className='w-4 h-4 ml-2' />
              الأعمدة
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='rtl' avoidCollisions={false}>
            {table
              .getAllColumns()
              .filter(
                column => !filteredColumns.includes(column.id) && column.getCanHide()
              )
              .map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className='capitalize'
                  checked={column.getIsVisible()}
                  onCheckedChange={value => {
                    column.toggleVisibility(!!value)
                    saveColumnVisibility(columnVisibility)
                  }}
                >
                  {replaceString(column.id)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder={`ما الذي تبحث عنه؟`}
          onChange={event => setFiltering(event.target.value)}
          defaultValue={filtering}
          className='max-w-sm'
        />
      </div>
      <div className='border rounded-md'>
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
            {table.getRowModel().rows.length > 0 ? (
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
                          <span className='flex items-center justify-center gap-x-3'>
                            <Copy
                              text={String(cell.getValue())}
                              className='inline w-6 h-6 ml-2'
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
                            (cell.getValue() as Stocks[]).reduce(
                              (stock: number, acc: Stocks) => stock + acc.stocks,
                              0
                            )
                          )
                        ) : cell.column.id.includes('shms_fullname') ? (
                          <Link
                            href={`/dashboard/users/${String(
                              cell.row.getValue('id') ?? cell.row.getValue('shms_user_id')
                            )}`}
                          >
                            {String(cell.getValue())}
                          </Link>
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
                      console.log(cell)

                      if (cell.id.includes('shms_withdraw_id')) {
                        return (
                          <TableCell key={cell.id}>
                            <OperationAction withdrawAction={data[rowIndex]} />
                          </TableCell>
                        )
                      } else if (cell.id.includes('id')) {
                        if (!cell.id.includes('shms_user_id')) {
                          // This MUST be cell.id.includes('id') for the user to be clickable
                          return (
                            <TableCell key={cell.id}>
                              <UsersActions
                                user={data as Users[]}
                                id={cell.getValue() as string}
                              />
                            </TableCell>
                          )
                        }
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
      <div className='flex items-center justify-end py-4 space-x-2'>
        <div className='flex-1 text-sm text-muted-foreground'>
          يتم عرض {table.getFilteredRowModel().rows.length}
          {table.getFilteredRowModel().rows.length > 1 ? ' صفوف' : ' صف'}
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

'use client'

import * as React from 'react'
import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
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
import { accountingOperationsProps } from '@/types'
import Copy from '@/components/custom/Copy'
import NoRecords from '@/components/custom/NoRecords'
import {
  formattedPrice,
  getProjectDate,
  getProjectStatus,
  replaceString
} from '@/lib/utils'
import Link from 'next/link'

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
  data,
  actionButtons
}: {
  data: accountingOperationsProps[] | any[]
  actionButtons: React.ReactNode
}) {
  const dynamicColumns = data.length > 0 ? Object.keys(data[0]) : []

  const columns: ColumnDef<any>[] = dynamicColumns.map(column => ({
    accessorKey: column,
    header: column,
    cell: ({ row }) => <div>{row.getValue(column)}</div>
  }))

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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
          <DropdownMenuContent align='end' className='rtl'>
            {table
              .getAllColumns()
              .filter(column => column.getCanHide())
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
          placeholder='إبحــــث في البيانات'
          value={(table.getColumn('shms_email')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('shms_email')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            replaceString(String(header.column.columnDef.header)),
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
                <TableHead>
                  {/* <Checkbox
                    checked={table.getIsAllRowsSelected()}
                    onCheckedChange={value => table.toggleAllRowsSelected(!!value)}
                  /> */}
                  الإجـــــراء
                </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.getValue() === 'pending'
                          ? 'text-yellow-500'
                          : cell.getValue() === 'completed'
                          ? 'text-green-500'
                          : cell.getValue() === 'rejected'
                          ? 'text-red-500'
                          : 'text-black'
                      }
                    >
                      {cell.column.id.includes('_id') ? (
                        <span className='flex'>
                          <Copy
                            text={String(cell.getValue())}
                            className='inline ml-2 w-10 h-10'
                          />{' '}
                          <span>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}{' '}
                          </span>
                        </span>
                      ) : cell.column.id.includes('accounting_operation_status') ||
                        cell.column.id.includes('shms_action_type') ? (
                        getProjectStatus(String(cell.getValue()))
                      ) : cell.column.id.includes('shms_created_at') ? (
                        getProjectDate(new Date(String(cell.getValue())))
                      ) : cell.column.id.includes('shms_withdraw_amount') ? (
                        formattedPrice(Number(cell.getValue()))
                      ) : cell.column.id.includes('shms_phone') ? (
                        <Link
                          href={`tel:${String(cell.getValue())}`}
                          className='text-blue-500 transition-colors hover:font-bold hover:text-blue-700'
                        >
                          {String(cell.getValue())}
                        </Link>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                  <TableCell>{actionButtons}</TableCell>
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
          {table.getFilteredSelectedRowModel().rows.length} من{' '}
          {table.getFilteredRowModel().rows.length}{' '}
          {table.getFilteredRowModel().rows.length > 1 ? 'صفوف' : 'صف'}{' '}
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

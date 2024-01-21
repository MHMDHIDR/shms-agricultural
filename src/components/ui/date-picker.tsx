'use client'

import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export function DatePicker({
  date,
  setDate,
  className,
  maxAge = 60
}: {
  date?: Date
  setDate: (date: Date) => void
  className?: string
  /**
   * @description the maximum age of the date that can be selected
   * @example if maxAge is 60, the maximum date will be 60 years ago
   */
  maxAge?: number
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={
            (cn(
              'w-full justify-start font-normal text-right',
              !date && 'text-muted-foreground'
            ),
            className)
          }
        >
          {date ? (
            format(date, 'EEEE, dd MMMM yyyy', {
              locale: ar
            })
          ) : (
            <span className='inline-block w-full'>
              <CalendarIcon className='ml-2 h-4 w-4 inline' />
              أختر تاريخ
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          fromDate={
            new Date(
              new Date().getFullYear() - maxAge,
              new Date().getMonth(),
              new Date().getDate()
            )
          }
          onSelect={(date: Date | undefined) => setDate(date || new Date())}
          locale={ar}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

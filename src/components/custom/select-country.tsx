'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { countryNames } from '@/data/list-of-countries'
import { cn } from '@/libs/utils'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

type SelectCountryProps = {
  nationality?: string
  setNationality: (value: string) => void
  placeholder?: string
  className?: string
}

// Mark the component as a Client Component
const SelectCountry = ({
  nationality,
  setNationality,
  placeholder = 'إختر الجنسية ...',
  className = ''
}: SelectCountryProps) => {
  const [open, setOpen] = useState(false)

  // Create a memoized handler for the selection
  const handleSelect = (currentValue: string) => {
    setNationality(currentValue === nationality ? '' : currentValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(`w-[200px] justify-between`, className)}
        >
          {nationality
            ? countryNames.find(countryName => countryName.label === nationality)?.label
            : placeholder}
          <CaretSortIcon className='w-4 h-4 ml-2 opacity-50 shrink-0' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-full p-0 overflow-y-auto max-h-64 md:max-h-96 rtl'
        avoidCollisions={false}
      >
        <Command>
          <CommandInput placeholder='إبحث عن الجنسية' className='px-4 h-9' />
          <CommandEmpty>عفواً لم يتم العثور على البلد</CommandEmpty>
          <CommandGroup>
            {countryNames.map(countryName => (
              <CommandItem
                key={countryName.code}
                value={countryName.label}
                onSelect={() => handleSelect(countryName.label)}
              >
                {countryName.label}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    nationality === countryName.label ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SelectCountry

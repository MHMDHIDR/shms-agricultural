"use client"

import { Check, ListCollapse } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { countryNames } from "@/lib/list-of-countries"
import { cn } from "@/lib/utils"

type SelectCountryProps = {
  nationality: string
  setNationality: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

// Mark the component as a Client Component
const SelectCountry = ({
  nationality,
  setNationality,
  placeholder = "إختر الجنسية ...",
  className = "",
  disabled = false,
}: SelectCountryProps) => {
  const [open, setOpen] = useState(false)

  // Create a memoized handler for the selection
  const handleSelect = (currentValue: string) => {
    setNationality(currentValue === nationality ? "" : currentValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            `w-full cursor-pointer justify-between ${disabled && "cursor-not-allowed"}`,
            className,
          )}
        >
          {countryNames.find(countryName => countryName.label.includes(nationality))?.label ??
            placeholder}
          <ListCollapse className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="rtl max-h-60 w-full max-w-56 overflow-y-auto p-0 md:max-h-96"
        avoidCollisions={false}
      >
        <Command>
          <CommandInput placeholder="إبحث عن الجنسية" className="h-9 px-4" />
          <CommandEmpty>عفواً لم يتم العثور على البلد</CommandEmpty>
          <CommandGroup>
            {countryNames.map(countryName => (
              <CommandItem
                key={countryName.code}
                value={countryName.label}
                onSelect={() => handleSelect(countryName.label)}
                className="cursor-pointer"
              >
                {countryName.label}
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    nationality === countryName.label ? "opacity-100" : "opacity-0",
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

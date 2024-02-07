'use client'
import { Button } from '@/components/ui/button'
import { MyTooltip } from '../ui/tooltip'
import { ChevronUp } from 'lucide-react'
import { scrollToView } from '@/lib/utils'

export function NavigateTop() {
  return (
    <MyTooltip text='الى الأعلى' className='translate-x-0'>
      <Button
        variant={'outline'}
        className='fixed opacity-80 hover:opacity-100 w-fit bottom-2.5 right-2.5 group'
        onClick={() => scrollToView(400)}
      >
        <ChevronUp
          strokeWidth={1.5}
          className='stroke-green-600 opacity-75 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-y-1 transition-transform'
        />
      </Button>
    </MyTooltip>
  )
}

'use client'
import { Button } from '@/components/ui/button'
import { MyTooltip } from '@/components/ui/tooltip'
import { ChevronUp } from 'lucide-react'
import { useState } from 'react'
import useEventListener from '@/hooks/useEventListener'
import { scrollToView } from '@/libs/utils'

export function NavigateTop({ scrolledHeight = 200 }: { scrolledHeight?: number }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const isSticky = () => {
    const scrollTop = window.scrollY
    scrollTop > scrolledHeight ? setIsScrolled(true) : setIsScrolled(false)
  }
  useEventListener('scroll', isSticky)

  return (
    <MyTooltip text='الى الأعلى' className='translate-x-0'>
      <Button
        variant={'outline'}
        className={`fixed opacity-80 hover:opacity-100 w-fit bottom-2.5 transition duration-700 right-2.5 group ${
          isScrolled ? `translate-x-0` : `translate-x-20`
        }`}
        onClick={() => scrollToView(400)}
      >
        <ChevronUp
          strokeWidth={1.5}
          className='opacity-75 stroke-green-600 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-y-1 transition-transform'
        />
      </Button>
    </MyTooltip>
  )
}

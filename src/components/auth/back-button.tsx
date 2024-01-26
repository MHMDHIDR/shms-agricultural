'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  href: string
  target?: string
  label: string | React.ReactNode
}

export const BackButton = ({ href, target, label }: BackButtonProps) => {
  return (
    <Button variant='link' className='w-full font-normal text-right' size='sm' asChild>
      <Link href={href} target={target ?? '_self'}>
        {label}
      </Link>
    </Button>
  )
}

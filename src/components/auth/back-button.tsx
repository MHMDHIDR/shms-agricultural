'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  href: string
  target?: string
  label: string
}

export const BackButton = ({ href, target, label }: BackButtonProps) => {
  return (
    <Button variant='link' className='font-normal w-full text-right' size='sm' asChild>
      <Link href={href} target={target ?? '_self'}>
        {label}
      </Link>
    </Button>
  )
}

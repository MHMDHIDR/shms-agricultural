'use client'

import { cn, handleCopyToClipboard } from '@/libs/utils'
import { Copy } from 'lucide-react'

export default function CopyText({
  text,
  className
}: {
  text: string
  className?: string
}) {
  return (
    <Copy
      onClick={() => handleCopyToClipboard(text)}
      className={cn('cursor-pointer opacity-70 hover:opacity-100', className)}
    />
  )
}

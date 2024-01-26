'use client'

import Image from 'next/image'
import { DownloadIcon } from '@radix-ui/react-icons'
import { saveAs } from 'file-saver'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { APP_LOGO } from '@/data/constants'

export default function Modal({
  title,
  description,
  document,
  className,
  children
}: {
  title: string
  description?: string
  document: string
  className?: string
  children: string | React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn(className)}>{children ?? 'إجراء'}</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-green-600 text-center select-none font-bold'>
            {title}
          </DialogTitle>
          <DialogDescription>{description ?? ''}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col items-center gap-y-6'>
          <Image
            src={document ?? APP_LOGO}
            alt={description ?? title}
            width={350}
            height={350}
            className='rounded-lg w-full max-h-72 object-contain'
          />

          <Button
            type='button'
            size='sm'
            className='px-3 w-32 md:w-full'
            onClick={() => saveAs(document, `${title}.jpg`)}
          >
            <span className='sr-only'>تحميل مستند {title}</span>
            <span className='w-full hidden md:inline-block'>تحميل المستند</span>
            <DownloadIcon className='h-4 w-4' />
          </Button>
        </div>
        <DialogFooter className='sm:justify-start mx-auto'>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              غلق
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { DownloadIcon } from '@radix-ui/react-icons'
import { saveAs } from 'file-saver'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
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
import { APP_LOGO } from '@/data/constants'
import { cn } from '@/libs/utils'

export default function Modal({
  title,
  description,
  document,
  className,
  contentClassName,
  asModal,
  asModalSlider,
  asText,
  images,
  startIndex,
  children
}: {
  title: string
  description?: string
  document: string
  className?: string
  contentClassName?: string
  asModal?: boolean
  asModalSlider?: boolean
  asText?: boolean
  images?: string[]
  startIndex?: number
  children: string | React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {asModal ? (
          children
        ) : (
          <Button className={cn(className)}>{children ?? 'إجراء'}</Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={cn(
          `sm:max-w-md ${asModalSlider ? 'p-0' : ''} ${asText ? 'sm:max-w-full' : ''}`,
          contentClassName
        )}
        asModalSlider={asModalSlider}
      >
        {!asModalSlider && (
          <DialogHeader>
            <DialogTitle className='font-bold [font-size:1rem_!important] text-center text-green-600 select-none'>
              {title}
            </DialogTitle>

            <DialogDescription>{description ?? ''}</DialogDescription>
          </DialogHeader>
        )}
        <div
          className={`flex flex-col items-center gap-y-6${
            asModalSlider ? ' min-h-full min-w-full' : ''
          }`}
        >
          {
            // if document contains pdf in the path then render pdf
            document?.includes('pdf') ? (
              <div className='w-full min-h-[15rem]'>
                <iframe src={document} className='w-full' height={600} title={title} />
              </div>
            ) : asModalSlider ? (
              <Carousel className='w-full' opts={{ loop: true }}>
                <CarouselContent>
                  {images?.map((image, index) => (
                    <CarouselItem key={index}>
                      <Image
                        src={
                          startIndex
                            ? // swap the first image with the selected image
                              // to start the carousel from the selected image
                              // then reset the startIndex to 0
                              images[startIndex] && index === 0
                              ? images[startIndex] ?? image
                              : images[index - 1] ?? image
                            : image
                        }
                        alt={description ?? title}
                        width={400}
                        height={400}
                        className='min-w-full min-h-full rounded-lg w-80 md:w-full h-60'
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : asText ? (
              <section
                className='text-lg leading-loose rtl'
                dangerouslySetInnerHTML={{ __html: document }}
              />
            ) : (
              <Image
                src={document ?? APP_LOGO}
                alt={description ?? title}
                width={350}
                height={350}
                className='object-contain w-full rounded-lg max-h-72'
              />
            )
          }

          {!asModal ||
            !asText ||
            (!asModalSlider && (
              <Button
                type='button'
                size='sm'
                className='w-32 px-3 md:w-full'
                onClick={() => saveAs(document, title)}
                variant={'pressable'}
              >
                <span className='sr-only'>تحميل مستند {title}</span>
                <span className='hidden w-full md:inline-block'>تحميل المستند</span>
                <DownloadIcon className='w-4 h-4' />
              </Button>
            ))}
        </div>
        {!asModal && (
          <DialogFooter className='mx-auto sm:justify-start'>
            <DialogClose asChild>
              <Button type='button' variant='outline' className='flex gap-x-2'>
                <strong>غلق</strong>
                <span className='text-xl'>&times;</span>
              </Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

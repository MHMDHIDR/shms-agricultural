'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Overlay from './Overlay'

export default function CarouselDApiDemo({
  images,
  className
}: {
  images: string[]
  className?: string
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [_current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap() + 1)
    api.on('select', () => setCurrent(api.selectedScrollSnap() + 1))
  }, [api])

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      plugins={[Autoplay({ delay: 3000 })]}
      className={cn(
        `min-w-full max-w-xs max-h-72 md:max-h-96 lg:max-h-[35rem] overflow-y-clip`,
        className
      )}
    >
      <CarouselContent overlay={<Overlay className='opacity-20' />}>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className='flex items-center justify-center w-screen min-w-[100svh] p-0'>
                <Image
                  src={image}
                  priority={true}
                  alt={`Slide ${index + 1}`}
                  className='object-cover w-full h-full'
                  width={'1024'}
                  height={'850'}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='z-[100]' />
      <CarouselNext className='z-[100]' />
    </Carousel>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
// import Overlay from './Overlay'

export default function CarouselDApiDemo({ images }: { images: string[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [_current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap() + 1)
    api.on('select', () => setCurrent(api.selectedScrollSnap() + 1))
  }, [api])

  return (
    <div>
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 3000 })]}
        className='min-w-full max-w-xs max-h-72 md:max-h-96 lg:max-h-[35rem] overflow-y-clip'
      >
        <CarouselContent /*overlay={<Overlay className='opacity-20' />}*/>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className='flex items-center justify-center w-screen min-w-[100svh] p-0'>
                  <Image
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className='w-full h-full object-cover'
                    width={'1024'}
                    height={'850'}
                    priority={true}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

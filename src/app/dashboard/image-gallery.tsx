import { APP_TITLE } from '@/data/constants'
import Image from 'next/image'

export default function ImageGallery() {
  const IMAGE_WIDTH = 300
  const IMAGE_HEIGHT = 600

  return (
    <div className='justify-center grid grid-cols-2 md:grid-cols-3 gap-6'>
      <div className='grid gap-6' id='one'>
        <Image
          src='/ImageGallery/1.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
        <Image
          src='/ImageGallery/2.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
        <Image
          src='/ImageGallery/3.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
        <Image
          src='/ImageGallery/4.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
        <Image
          src='/ImageGallery/5.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
      </div>
      <div className='grid gap-6' id='two'>
        <Image
          src='/ImageGallery/6.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
        <Image
          src='/ImageGallery/12.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
        <Image
          src='/ImageGallery/7.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
        <Image
          src='/ImageGallery/8.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
      </div>
      <div className='grid gap-6' id='three'>
        <Image
          src='/ImageGallery/9.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
        <Image
          src='/ImageGallery/13.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
        <Image
          src='/ImageGallery/10.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
        <Image
          src='/ImageGallery/11.jpg'
          width={IMAGE_WIDTH}
          height={IMAGE_HEIGHT}
          alt={APP_TITLE}
          className='rounded-lg w-auto'
        />
      </div>
    </div>
  )
}

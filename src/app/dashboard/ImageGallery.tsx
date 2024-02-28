import { APP_TITLE } from '@/data/constants'
import Image from 'next/image'

export default function ImageGallery() {
  return (
    <div className='parent-container'>
      <div className='child-container' id='one'>
        <Image src='/ImageGallery/1.jpg' width={300} height={600} alt={APP_TITLE} />
        <Image src='/ImageGallery/2.jpg' width={300} height={600} alt={APP_TITLE} />
        <Image src='/ImageGallery/3.jpg' width={300} height={600} alt={APP_TITLE} />
        <Image src='/ImageGallery/4.jpg' width={300} height={600} alt={APP_TITLE} />
        <Image src='/ImageGallery/5.jpg' width={300} height={600} alt={APP_TITLE} />
      </div>
      <div className='child-container' id='two'>
        <Image src='/ImageGallery/6.jpg' width={300} height={600} alt={APP_TITLE} />
        <Image src='/ImageGallery/12.jpg' width={300} height={600} alt={APP_TITLE} />
        <Image src='/ImageGallery/7.jpg' width={300} height={600} alt={APP_TITLE} />
        <Image src='/ImageGallery/8.jpg' width={300} height={600} alt={APP_TITLE} />
      </div>
      <div className='child-container' id='three'>
        <Image src='/ImageGallery/9.jpg' width={300} height={600} alt={APP_TITLE} />
        <Image src='/ImageGallery/13.jpg' width={300} height={600} alt={APP_TITLE} />
        <Image src='/ImageGallery/10.jpg' width={300} height={600} alt={APP_TITLE} />
        <Image src='/ImageGallery/11.jpg' width={300} height={600} alt={APP_TITLE} />
      </div>
    </div>
  )
}

import Image from 'next/image'
import Modal from '@/components/custom/Modal'

const ProjectImages = ({ images }: { images: string[] }) => {
  return (
    <main className={`my-10`}>
      <div
        className={`grid grid-cols-2 sm:grid-cols-${images.length - 1} gap-4 md:gap-x-10`}
      >
        {images.map((imageUrl, index) => (
          <Modal
            key={index}
            title=''
            document={imageUrl}
            className='font-bold dark:text-white'
            asModal
            asModalSlider
            images={images}
            startIndex={index}
          >
            <Image
              src={imageUrl}
              priority={true}
              property='og:image'
              alt='project image'
              width={300}
              height={300}
              className='object-cover w-full h-40 rounded-md md:min-h-56 md:min-w-56 aspect-square cursor-zoom-in'
            />
          </Modal>
        ))}
      </div>
    </main>
  )
}

export default ProjectImages

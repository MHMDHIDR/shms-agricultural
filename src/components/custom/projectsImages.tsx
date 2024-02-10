import Image from 'next/image'
import Modal from '@/components/custom/Modal'

const ProjectImages = ({ images }: { images: string[] }) => {
  return (
    <main className={`my-10`}>
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 col-rows-4 gap-4 lg:gap-x-56`}
      >
        {images.map((imageUrl, index) => (
          <Modal
            title=''
            document={imageUrl}
            className='font-bold dark:text-white'
            key={index}
            asModal
            asModalSlider
            images={images}
          >
            <Image
              src={imageUrl}
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

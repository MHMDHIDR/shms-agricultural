'use client'
import { useState } from 'react'
import Image from 'next/image'
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa'

const ProjectImages = ({ images }: { images: string[] }) => {
  const [showModal, setShowModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const openModal = (index: number) => {
    setSelectedImageIndex(index)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleNext = () => {
    setSelectedImageIndex(prevIndex => (prevIndex + 1) % images.length)
  }

  const handlePrev = () => {
    setSelectedImageIndex(prevIndex => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <main className={`my-10`}>
      <div
        className={`grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 col-rows-4 gap-4`}
      >
        {images ? (
          images.map((imageUrl, index) => (
            <Image
              key={index}
              src={imageUrl}
              alt={`Image ${index + 1}`}
              width={600}
              height={450}
              className='w-56 h-40 rounded-lg hover:cursor-zoom-in'
              onClick={() => openModal(index)}
            />
          ))
        ) : (
          <Image
            src='/logo-slogan.png'
            alt='No Image'
            width={250}
            height={300}
            className='m-10'
          />
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999 // Ensure modal is on top of everything
          }}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw', // Limit modal width to 90% of viewport width
              maxHeight: '90vh', // Limit modal height to 90% of viewport height
              overflow: 'auto',
              padding: 10
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10
              }}
              dir='rtl'
            >
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={closeModal}
              >
                <FaTimes size={24} color='#333' />
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Image
                src={images[selectedImageIndex]!}
                alt='Full Screen Image'
                layout='responsive'
                width={600}
                height={450}
              />
              <button
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#333',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '5px 10px',
                  borderRadius: 100
                }}
                onClick={handlePrev}
              >
                <FaArrowLeft size={24} color='#333' />
              </button>
              <button
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#333',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '5px 10px',
                  borderRadius: 100
                }}
                onClick={handleNext}
              >
                <FaArrowRight size={24} color='#333' />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default ProjectImages

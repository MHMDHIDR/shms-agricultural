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
    <main className={`flex min-h-screen items-center justify-between p-24`}>
      <div>
        {images ? (
          images.map((imageUrl, index) => (
            <Image
              key={index}
              src={imageUrl}
              alt={`Image ${index + 1}`}
              width={500}
              height={300}
              style={{ margin: 50 }}
              className='hover:cursor-zoom-in w-96 h-96'
              onClick={() => openModal(index)}
            />
          ))
        ) : (
          <Image
            src='/logo-slogan.png'
            alt='No Image'
            width={500}
            height={300}
            style={{ margin: 50 }}
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
            marginTop: 50
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 8,
              width: '60%',
              maxWidth: 600
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
              {/* سهم الاغلاق - Close Button */}
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
                width={600}
                height={450}
              />
              {/* السهم اليسار - Arrow Left */}
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
              {/* السهم اليمين - Arrow Right */}
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

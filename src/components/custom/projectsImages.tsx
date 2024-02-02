'use client'

import Modal from '@/components/custom/Modal'
// import 'bootstrap/dist/css/bootstrap.min.css'
import { useState } from 'react'
// import { Button, Modal } from 'react-bootstrap'

export default function ProjectImages({ images }: { images: string[] }) {
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
        {images.map((imageUrl, index) => (
          <Modal
            key={index}
            title={`صور مشروع`}
            images={images}
            className='font-bold dark:text-white'
            asModal
            asSlider
          >
            <img
              src={imageUrl}
              alt={`Image ${index + 1}`}
              width={500}
              height={300}
              style={{ margin: 50, cursor: 'pointer' }}
              onClick={() => openModal(index)}
            />
          </Modal>
        ))}
      </div>

      {/* <Modal
        show={showModal}
        onHide={closeModal}
        dialogClassName='full-screen-modal'
        centered
      >
        <Modal.Header closeButton />
        <Modal.Body>
          <div style={{ position: 'relative' }}>
            <Image
              src={images[selectedImageIndex]!}
              alt='Full Screen Image'
              width={800}
              height={600}
            />
            <Button
              variant='secondary'
              style={{ position: 'absolute', left: 0 }}
              onClick={handlePrev}
            >
              Previous
            </Button>
            <Button
              variant='secondary'
              style={{ position: 'absolute', right: 0 }}
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </main>
  )
}

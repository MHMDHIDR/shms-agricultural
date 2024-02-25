'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

function VissionImage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = window.navigator.userAgent
    const mobileKeywords = ['Mobile', 'Android', 'iPhone', 'iPad', 'Windows Phone']
    const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword))
    setIsMobile(isMobileDevice)
  }, [])

  return (
    <div>
      {isMobile ? (
        <>
          <div className='flex items-center justify-center w-full bg-transparent md:w-500 md:h-500 hover:opacity-90 hover:-translate-y-1 transition'>
            <div
              style={{
                width: 200,
                height: 150,
                backgroundColor: 'green',
                marginBottom: 150,
                marginRight: -100,
                borderTopRightRadius: 100,
                borderBottomLeftRadius: 100
              }}
            >
              {' '}
            </div>
            <Image
              src='https://assets.raya.com/wp-content/uploads/2020/11/03220331/951165.jpeg'
              alt='Image 1'
              width={500}
              height={500}
              className='object-cover w-full h-full border-4 rounded-full border-darkgreen'
              style={{ maxWidth: '80%' }}
            />
          </div>
          <div className='mt-4 md:mt-0'>
            <p className='text-center' style={{ color: 'gray', fontSize: 15 }}>
              ان يكون السودان هو فعليا سلة غذاء العالم وان يكون رائدا بين الدول العربية في
              مجال الزراعة وتطوير الادوات الزراعية وتحسين جودة المزروعات مما يسهم بشكل
              كبير في النمو الاقتصادي للفرد وللدولة على حد سواء
            </p>
          </div>
        </>
      ) : (
        <>
          <div className='flex items-center justify-center w-full bg-transparent md:w-500 md:h-500 hover:opacity-90 hover:-translate-y-1 transition'>
            <div
              style={{
                width: 400,
                height: 300,
                backgroundColor: 'green',
                marginBottom: 600,
                marginRight: -300,
                borderTopRightRadius: 100,
                borderBottomLeftRadius: 100
              }}
            >
              {' '}
            </div>
            <Image
              src='https://assets.raya.com/wp-content/uploads/2020/11/03220331/951165.jpeg'
              alt='Image 1'
              width={500}
              height={500}
              className='object-cover w-full h-full border-4 rounded-full border-darkgreen'
              style={{ maxWidth: '80%' }}
            />
          </div>
          <div className='mt-4 md:mt-0'>
            <p className='text-center' style={{ color: 'gray', fontSize: 15 }}>
              ان يكون السودان هو فعليا سلة غذاء العالم وان يكون رائدا بين الدول العربية في
              مجال الزراعة وتطوير الادوات الزراعية وتحسين جودة المزروعات مما يسهم بشكل
              كبير في النمو الاقتصادي للفرد وللدولة على حد سواء
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default VissionImage

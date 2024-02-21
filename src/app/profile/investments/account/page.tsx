'use client'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Account() {
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
        <div style={{ marginTop: 20 }} className='flex flex-col'>
          {/* First Card */}
          <Card style={{ width: '100%', marginBottom: 20 }} className='p-10 rtl'>
            <CardContent className='text-center'>
              <div className='p-4 border'>
                <h1 className='text-lg font-bold'>الرصيد الكلي</h1>
                <hr className='my-2 border-gray-300' />
                <h3 style={{ fontWeight: 'bold', fontSize: 20 }}>0.0</h3>
              </div>
              <div className='p-4 mt-4 border'>
                <h1 style={{ color: 'lightgreen' }} className='text-lg font-bold'>
                  الرصيد القابل للسحب
                </h1>
                <hr className='my-2 border-gray-300' />
                <h3
                  style={{
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: 'lightgreen'
                  }}
                >
                  0.0
                </h3>
              </div>
            </CardContent>
          </Card>

          {/* Second Card (Smaller Card) */}
          <Card style={{ width: '100%' }} className='p-10 rtl'>
            <CardContent className='text-center'>
              <h1> personal information </h1>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div style={{ marginTop: 20 }} className='flex'>
          {/* First Card */}
          <Card style={{ width: '70%' }} className='mr-10 rtl p-14'>
            {/* Added mr-4 for margin */}
            <CardContent className='text-center'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {/* First Grid Item */}
                <div className='p-4 border rtl'>
                  <h1 className='text-lg font-bold'>الرصيد الكلي</h1>
                  <hr className='my-2 border-gray-300' />
                  <h3 style={{ fontWeight: 'bold', fontSize: 30 }}>0.0</h3>
                </div>

                {/* Second Grid Item */}
                <div className='p-4 border rtl'>
                  <h1 style={{ color: 'lightgreen' }} className='text-lg font-bold'>
                    الرصيد القابل للسحب
                  </h1>
                  <hr className='my-2 border-gray-300' />
                  <h3
                    style={{
                      fontWeight: 'bold',
                      fontSize: 30,
                      color: 'lightgreen'
                    }}
                  >
                    0.0
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Second Card (Smaller Card) */}
          <Card style={{ width: '30%' }} className='p-10 rtl'>
            {/* Reduced padding to make it smaller */}
            <CardContent className='flex flex-col items-center justify-center text-center'>
              <h1>الملف الشخصي</h1>

              <Link
                href='/profile'
                className='mt-10 w-fit py-2.5 px-6 rounded-md font-bold text-white bg-purple-500 shadow min-w-56 hover:bg-purple-400 focus:shadow-outline focus:outline-none'
              >
                تعديل الملف الشخصي
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

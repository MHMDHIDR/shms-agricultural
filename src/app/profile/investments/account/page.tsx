'use client'
import { Card, CardContent } from '@/components/ui/card'
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
          <Card style={{ width: '100%', marginBottom: 20 }} className='rtl p-10'>
            <CardContent className='text-center'>
              <div className='border p-4'>
                <h1 className='font-bold text-lg'>الرصيد الكلي</h1>
                <hr className='my-2 border-gray-300' />
                <h3 style={{ fontWeight: 'bold', fontSize: 20 }}>0.0</h3>
              </div>
              <div className='border p-4 mt-4'>
                <h1 style={{ color: 'lightgreen' }} className='font-bold text-lg'>
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
          <Card style={{ width: '100%' }} className='rtl p-10'>
            <CardContent className='text-center'>
              <h1> personal information </h1>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div style={{ marginTop: 20 }} className='flex'>
          {/* First Card */}
          <Card style={{ width: '70%' }} className='rtl p-14 mr-10'>
            {/* Added mr-4 for margin */}
            <CardContent className='text-center'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* First Grid Item */}
                <div className='rtl border p-4'>
                  <h1 className='font-bold text-lg'>الرصيد الكلي</h1>
                  <hr className='my-2 border-gray-300' />
                  <h3 style={{ fontWeight: 'bold', fontSize: 30 }}>0.0</h3>
                </div>

                {/* Second Grid Item */}
                <div className='rtl border p-4'>
                  <h1 style={{ color: 'lightgreen' }} className='font-bold text-lg'>
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
          <Card style={{ width: '30%' }} className='rtl p-10'>
            {/* Reduced padding to make it smaller */}
            <CardContent className='text-center'>
              <h1>الملف الشخصي</h1>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

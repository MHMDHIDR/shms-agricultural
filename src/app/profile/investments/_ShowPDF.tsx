'use client'

import { Button } from '@/components/ui/button'
import { APP_LOGO, APP_TITLE, APP_URL, SHMS_EMAIL, SHMS_PHONE } from '@/data/constants'
import { getProjectDate } from '@/lib/utils'
import { generatePDFProps } from '@/types'
import { useRef, useCallback, useEffect, useState } from 'react'
import { useReactToPrint } from 'react-to-print'

export default function Contract({
  children,
  dataToShow
}: {
  children: string
  dataToShow: generatePDFProps
}) {
  const [isLoading, setIsLoading] = useState(false)

  const componentRef = useRef(null)
  const onBeforeGetContentResolve = useRef<any>(null)
  const handleOnBeforeGetContent = useCallback(() => {
    setIsLoading(true)

    return new Promise<void>(resolve => {
      onBeforeGetContentResolve.current = resolve
      setTimeout(() => {
        setIsLoading(false)
        resolve()
      }, 2000)
    })
  }, [setIsLoading])
  const reactToPrintContent = useCallback(() => componentRef.current, [])

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: 'Invoice',
    onBeforeGetContent: handleOnBeforeGetContent
  })

  useEffect(() => {
    if (typeof onBeforeGetContentResolve.current === 'function') {
      onBeforeGetContentResolve.current()
    }
  }, [setIsLoading])

  return (
    <>
      {isLoading && <Invoice dataToShow={dataToShow} forwardedRef={componentRef} />}
      <Button variant={'pressable'} onClick={handlePrint}>
        {children}
      </Button>
    </>
  )
}

const Invoice = ({
  dataToShow,
  forwardedRef
}: {
  dataToShow: generatePDFProps
  forwardedRef: any
}) => {
  const {
    investorName,
    projectName,
    stocksPurchased,
    totalAmount,
    totalProfit,
    profitsCollectDate,
    referenceCode
  } = dataToShow

  return (
    <div className='hidden'>
      <div
        ref={forwardedRef}
        className='flex flex-col justify-between h-screen px-10 py-6 bg-white min-w-min ltr rounded-xl'
      >
        <div
          style={{
            maxWidth: '750px',
            padding: '10px',
            margin: '0 auto',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              direction: 'rtl',
              textAlign: 'right',
              color: '#333',
              userSelect: 'none'
            }}
          >
            <div>
              <img
                src={APP_LOGO}
                height='100'
                width='150'
                alt={APP_TITLE}
                style={{ width: '150px', height: '100px', marginInline: 'auto' }}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h1>{APP_TITLE}</h1>
              <p style={{ fontSize: '12px', color: '#ccc' }}>{SHMS_EMAIL}</p>
              <p style={{ fontSize: '12px', color: '#ccc', direction: 'ltr' }}>
                {SHMS_PHONE}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              direction: 'rtl',
              textAlign: 'right'
            }}
          >
            <div>
              <p style={{ fontWeight: 'bold', color: '#333' }}>عقد استثمار شراء أسهم</p>
              <p style={{ color: '#333' }}>{investorName}</p>
              <p style={{ fontWeight: 'bold', color: '#2a9d8f' }}>{projectName}</p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#333' }}>
                تاريخ الإنشاء:{' '}
                <span style={{ color: '#333' }}>{getProjectDate(new Date())}</span>
              </p>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                borderRadius: '10px',
                border: '1px solid #ccc'
              }}
            >
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th
                    style={{
                      padding: '10px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#333'
                    }}
                  >
                    اسم المشروع
                  </th>
                  <th
                    style={{
                      padding: '10px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#333'
                    }}
                  >
                    عدد الأسهم
                  </th>
                  <th
                    style={{
                      padding: '10px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#333'
                    }}
                  >
                    إجمالي الدفع
                  </th>
                  <th
                    style={{
                      padding: '10px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#333'
                    }}
                  >
                    الأرباح
                  </th>
                  <th
                    style={{
                      padding: '10px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#333'
                    }}
                  >
                    تاريخ استلام الأرباح
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>
                    {projectName}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>
                    {stocksPurchased}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>
                    {totalAmount}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>
                    {totalProfit}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>
                    {getProjectDate(new Date(profitsCollectDate))}
                  </td>
                </tr>
              </tbody>
            </table>
            <p
              style={{
                marginBlock: '20px',
                paddingTop: '20px',
                textAlign: 'right',
                fontSize: '15px',
                color: '#666'
              }}
            >
              هذا العقد يشهد على شراء عدد <strong>{stocksPurchased}</strong> من أسهم مشروع{' '}
              {projectName}
            </p>
            <p
              style={{
                marginBlock: '20px',
                paddingTop: '20px',
                textAlign: 'right',
                fontSize: '15px',
                color: '#333'
              }}
            >
              تم شراء الأسهم بمبلغ{'  '}
              <strong
                style={{
                  color: '#2a9d01',
                  fontWeight: 'bold',
                  textDecoration: 'underline'
                }}
              >
                {totalAmount} ريال قطري فقط{'  '}
              </strong>
              وتم ذلك في تاريخ {getProjectDate(new Date())}
            </p>
            <p
              style={{
                marginBlock: '20px',
                paddingTop: '20px',
                textAlign: 'right',
                fontSize: '15px',
                color: '#333'
              }}
            >
              وسيتم تسليم الأرباح في تاريخ{' '}
              {profitsCollectDate
                ? getProjectDate(new Date(profitsCollectDate))
                : 'غير محدد'}
            </p>
          </div>

          <div style={{ direction: 'rtl', textAlign: 'right', marginTop: '400px' }}>
            <p style={{ color: '#666', fontSize: '10px' }}>
              الرقم المرجعي
              <br />
              <span style={{ color: '#ccc' }}>{referenceCode}</span>
            </p>
          </div>

          <div
            style={{
              borderTop: '1px solid #ccc',
              paddingTop: '7px',
              fontSize: '12px',
              color: '#ccc',
              textAlign: 'center'
            }}
          >
            <p style={{ marginTop: '30px', color: '#666', fontSize: '15px' }}>
              &copy; {new Date().getFullYear()} {APP_TITLE}
            </p>
            <span style={{ color: '#999', fontSize: '15px' }}>{APP_URL}</span>
            <span style={{ color: '#666', fontSize: '15px' }}>جميع الحقوق محفوظة</span>
          </div>
        </div>
      </div>
    </div>
  )
}

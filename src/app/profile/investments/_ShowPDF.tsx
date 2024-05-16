'use client'

import Divider from '@/components/custom/Divider'
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YouTubeIcon
} from '@/components/icons/Socials'
import { Button } from '@/components/ui/button'
import { APP_LOGO, APP_TITLE, APP_URL, SHMS_EMAIL } from '@/data/constants'
import { getProjectDate } from '@/lib/utils'
import { generatePDFProps } from '@/types'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useRef, useCallback, useEffect, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import Image from 'next/image'

export default function Contract({ dataToShow }: { dataToShow: generatePDFProps }) {
  const [isLoadingPDF, setIsLoadingPDF] = useState(false)

  const componentRef = useRef(null)
  const onBeforeGetContentResolve = useRef<any>(null)
  const handleOnBeforeGetContent = useCallback(() => {
    setIsLoadingPDF(true)

    return new Promise<void>(resolve => {
      onBeforeGetContentResolve.current = resolve
      setTimeout(() => {
        setIsLoadingPDF(false)
        resolve()
      }, 2000)
    })
  }, [setIsLoadingPDF])
  const reactToPrintContent = useCallback(() => componentRef.current, [])

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: dataToShow.referenceCode,
    onBeforeGetContent: handleOnBeforeGetContent
  })

  useEffect(() => {
    if (typeof onBeforeGetContentResolve.current === 'function') {
      onBeforeGetContentResolve.current()
    }
  }, [setIsLoadingPDF])

  return (
    <>
      {isLoadingPDF && <Invoice dataToShow={dataToShow} forwardedRef={componentRef} />}
      <Button
        variant={'pressable'}
        onClick={handlePrint}
        className={isLoadingPDF ? 'cursor-progress opcacity-50 pointer-events-none' : ''}
      >
        {isLoadingPDF ? (
          <>
            <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
            جاري العرض ...
          </>
        ) : (
          'عرض عقد الشراء'
        )}
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
    investorPhone,
    investorEmail,
    stocksPurchased,
    totalAmount,
    profitPerStock,
    totalProfit,
    profitsCollectDate,
    purchaseDate,
    projectTerms,
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
            width: '1000px',
            height: '1500px',
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
              textAlign: 'right'
            }}
          >
            <div>
              <p style={{ fontWeight: 'bold', color: '#333' }}>
                الطرف الأول:
                <br />
                <span style={{ fontWeight: 'bold', color: '#333' }}>
                  شركة {APP_TITLE}
                </span>
                <br />
                <span style={{ fontWeight: 'bold', color: '#333' }}>{SHMS_EMAIL}</span>
              </p>
            </div>

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
              <div className='w-32 h-40 mx-auto'>
                <Image
                  src={APP_LOGO}
                  height='100'
                  width='150'
                  alt={APP_TITLE}
                  style={{ width: '150px', height: '100px', marginInline: 'auto' }}
                />
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 'bold', color: '#333' }}>
                الطرف الثاني:
                <br />
                <span style={{ fontWeight: 'bold', color: '#333' }}>{investorName}</span>
                <br />
                <span style={{ fontWeight: 'bold', color: '#333' }}>{investorPhone}</span>
                <br />
                <span style={{ fontWeight: 'bold', color: '#333' }}>{investorEmail}</span>
              </p>
            </div>
          </div>

          <div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                borderRadius: '10px',
                border: '1px solid #ccc',
                direction: 'rtl'
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
                    ربح السهم الواحد
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
                  <td
                    style={{
                      padding: '10px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: '#2a9d8f'
                    }}
                  >
                    {projectName}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>
                    {stocksPurchased}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>
                    {totalAmount}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'right', color: '#333' }}>
                    {profitPerStock}
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
                marginBlock: '10px',
                paddingTop: '10px',
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
                marginBlock: '10px',
                paddingTop: '10px',
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
              وتم ذلك في تاريخ {getProjectDate(purchaseDate)}
            </p>
            <p
              style={{
                marginBlock: '10px',
                paddingTop: '10px',
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

          {/* projectTerms */}
          <div className='p-5 mt-4 text-right border border-gray-200 rounded-lg rtl'>
            <h4>
              <strong>شروط العقد</strong>
            </h4>
            <p
              className='text-justify text-gray-600 leading-10'
              dangerouslySetInnerHTML={{
                __html: projectTerms || 'لا توجد شروط خاصة لهذا المشروع'
              }}
            />
          </div>

          <div className='mt-5 md:mt-7 text-right' dir='rtl'>
            <p style={{ color: '#666', fontSize: '10px' }}>
              الرقم المرجعي
              <br />
              <span style={{ color: '#ccc' }}>{referenceCode}</span>
            </p>
          </div>

          <Divider className='mt-6 mb-0' />

          <section className='flex justify-between w-full text-xs text-center text-gray-400 pt-5'>
            <div className='flex flex-col items-start gap-y-3'>
              <div className='flex items-center opacity-80'>
                <FacebookIcon className='w-5 h-5 md:w-6 md:h-6' />
                <span className='ml-3'>facebook.com/shmsagri</span>
              </div>
              <div className='flex items-center opacity-80'>
                <InstagramIcon className='w-5 h-5 md:w-6 md:h-6' />
                <span className='ml-3'>instagram.com/shmsagri</span>
              </div>
              <div className='flex items-center opacity-80'>
                <YouTubeIcon className='w-5 h-5 md:w-6 md:h-6' />
                <span className='ml-3'>youtube.com/@shmsagri</span>
              </div>
              <div className='flex items-center opacity-80'>
                <TwitterIcon className='w-5 h-5 md:w-6 md:h-6' />
                <span className='ml-3'>twitter.com/@shmsagri</span>
              </div>
            </div>
            <div className='flex flex-col items-end gap-y-3'>
              <span className='text-sm text-gray-900'>{APP_URL}</span>
              <span className='text-sm text-gray-600'>جميع الحقوق محفوظة</span>
              <p className='text-sm text-gray-600'>
                &copy; {new Date().getFullYear()} {APP_TITLE}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

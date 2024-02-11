'use client'

import Image from 'next/image'
import Layout from '@/components/custom/Layout'
import { CardWrapper } from '@/components/auth/card-wrapper'
import PaymentMetods from '@/components/custom/PaymentMetods'
import Modal from '@/components/custom/Modal'
import type { UserLoggedInProps, stocksPurchasedProps } from '@/types'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Error, Loading, Success } from '@/components/icons/Status'
import { API_URL, APP_LOGO, DEFAULT_DURATION } from '@/data/constants'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import ModalMessage from '@/components/custom/ModalMessage'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function PersonalData({
  params: { id: projectId /*, slug*/ }
}: {
  params: { id: string /*, slug: string*/ }
}) {
  const { data: session }: { data: UserLoggedInProps } = useSession()
  const [userId, setUserId] = useState<string | null>('')
  const [stocksPurchesed, setStocksPurchesed] = useState<number>(0)
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [stockItems, setStockItems] = useState<stocksPurchasedProps>()

  const { push } = useRouter()

  useEffect(() => {
    if (session) {
      setUserId(session?.token?.user.shms_id ?? null)
    }

    if (localStorage.getItem('shms_project')) {
      setStockItems(JSON.parse(localStorage.getItem('shms_project') as string))
    }
  }, [session])

  const handleConfirmation = () => {
    if (!session) {
      toast(JSON.stringify('يجب عليك تسجيل الدخول!'), {
        icon: <Error className='w-6 h-6 ml-3' />,
        position: 'bottom-center',
        className: 'text-right select-none rtl',
        style: {
          backgroundColor: '#FFF0F0',
          color: '#BE2A2A',
          border: '1px solid #BE2A2A',
          gap: '1.5rem',
          textAlign: 'justify'
        }
      })
    } else {
      savePurchase()
    }
  }

  const savePurchase = async () => {
    setLoading(true)

    toast('جاري إتمام عملية شراء الأسهم  ...', {
      icon: <Loading className='text-blue-300' />,
      position: 'bottom-center',
      className: 'text-right select-none rtl',
      duration: DEFAULT_DURATION / 1.45,
      style: {
        backgroundColor: '#ccf0ff',
        color: '#00415c',
        border: '1px solid #00415c',
        gap: '1.5rem',
        textAlign: 'justify'
      }
    })

    try {
      const createdAt = new Date().toISOString()
      const {
        data: { stocksPurchesed, message }
      } = await axios.patch(`${API_URL}/stocks/add`, {
        userId,
        shms_project_id: projectId,
        stocks: stockItems?.stocks,
        newPercentage: stockItems?.newPercentage,
        percentageCode: stockItems?.percentageCode,
        createdAt
      })

      setMessage(message)
      setStocksPurchesed(stocksPurchesed)
      if (stocksPurchesed === 1) {
        localStorage.removeItem('shms_project')
        setTimeout(() => push(`/profile/investments`), DEFAULT_DURATION)
      }
    } catch (error) {
      console.error('error -->', error)
      toast('حدثت مشكلة أثناء إتمام عملية شراء الأسهم، حاول مرة أخرى لاحقا', {
        icon: <Error className='w-6 h-6 ml-3' />,
        position: 'bottom-center',
        className: 'text-right select-none rtl',
        style: {
          backgroundColor: '#FFF0F0',
          color: '#BE2A2A',
          border: '1px solid #BE2A2A',
          gap: '1.5rem',
          textAlign: 'justify'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      {stocksPurchesed === 1 && (
        <ModalMessage status={<Success className='w-24 h-24' />}>{message}</ModalMessage>
      )}
      <main className='flex flex-col items-center justify-between min-h-screen sm:p-24'>
        <div dir='rtl' className='flex items-center justify-center w-full'>
          <CardWrapper heading='البيانات الشخصية'>
            <form dir='rtl' className='w-full max-w-fit md:m-5' noValidate>
              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    البريد الالكتروني
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <span className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'>
                    {session?.token?.user.shms_email ?? (
                      <Skeleton className='w-full h-4 bg-gray-300' />
                    )}
                  </span>
                </div>
              </div>

              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    الاسم
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <span className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'>
                    {session?.token?.user.fullname ?? (
                      <Skeleton className='w-full h-4 bg-gray-300' />
                    )}
                  </span>
                </div>
              </div>

              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    رقم الهاتف
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <span className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'>
                    {session?.token?.user.shms_phone ?? (
                      <Skeleton className='w-full h-4 bg-gray-300' />
                    )}
                  </span>
                </div>
              </div>

              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    صورة المستند
                  </label>
                </div>
                <div className='relative'>
                  <Modal
                    title={`صورة المستند لــ ${session?.token?.user.fullname}`}
                    document={session?.token?.user.shms_doc ?? APP_LOGO}
                    className='font-bold dark:text-white'
                    asModal
                  >
                    <Image
                      src={session?.token?.user.shms_doc ?? APP_LOGO}
                      alt='Your Image Alt Text'
                      style={{ borderRadius: 5 }}
                      className='p-4 border border-gray-600 dark:border dark:bg-gray-800 rounded-lg cursor-pointer w-72'
                      width={350}
                      height={350}
                    />
                  </Modal>
                </div>
              </div>

              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    طريقة الدفع
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <br />
                  <PaymentMetods />
                </div>
              </div>
            </form>
          </CardWrapper>
        </div>

        <div className='flex items-center justify-center w-full m-5 space-x-4'>
          <Button
            className={`pressable ${
              loading ? 'opacity-50 hover:pointer-events-none cursor-not-allowed' : ''
            }`}
            onClick={handleConfirmation}
            aria-disabled={loading}
            disabled={loading}
          >
            {loading ? (
              <span className='flex items-center justify-center space-x-2'>
                <Loading className='w-6 h-6' />
                <span className='rtl'>جاري إتمام عملية الشراء ...</span>
              </span>
            ) : (
              'تأكيد بيانات الشراء'
            )}
          </Button>
          <Link
            href={`/projects/${projectId}/buy`}
            className={`pressable ${
              loading ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''
            }`}
          >
            {loading ? (
              <span className='flex items-center justify-center space-x-2'>
                <Loading className='w-6 h-6' />
                <span className='rtl'>جاري إتمام عملية الشراء ...</span>
              </span>
            ) : (
              'تعديل البيانات'
            )}
          </Link>
        </div>
      </main>
    </Layout>
  )
}

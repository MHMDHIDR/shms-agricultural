'use client'

import Image from 'next/image'
import Layout from '@/components/custom/Layout'
import { CardWrapper } from '@/components/auth/card-wrapper'
import PaymentMetods from '@/components/custom/PaymentMetods'
import Modal from '@/components/custom/Modal'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Error, Loading, Success } from '@/components/icons/Status'
import { API_URL, APP_LOGO, DEFAULT_DURATION } from '@/data/constants'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState } from 'react'
import ModalMessage from '@/components/custom/ModalMessage'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import type {
  UserLoggedInProps,
  getAuthType,
  selectedPaymentOptions,
  stocksPurchasedProps
} from '@/types'

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
  const [userData, setUserData] = useState<getAuthType>()
  const [selectedOption, setSelectedOption] = useState<selectedPaymentOptions>('cash')

  const { push, replace } = useRouter()

  useEffect(() => {
    if (session) {
      setUserId(session?.token?.user.shms_id ?? null)
    }

    if (localStorage.getItem('shms_project')) {
      setStockItems(JSON.parse(localStorage.getItem('shms_project') as string))
    }
  }, [session])

  useEffect(() => {
    if (localStorage.getItem('shms_user_data')) {
      setUserData(JSON.parse(localStorage.getItem('shms_user_data') as string))
    }
  }, [])

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
      duration: DEFAULT_DURATION,
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
        userId: userData?.userId ?? userId,
        shms_project_id: projectId,
        stocks: stockItems?.stocks,
        newPercentage: stockItems?.newPercentage,
        percentageCode: stockItems?.percentageCode,
        paymentMethod: selectedOption,
        createdAt
      })

      setMessage(message)
      setStocksPurchesed(stocksPurchesed)
      if (stocksPurchesed === 1) {
        localStorage.removeItem('shms_project')
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message ?? 'حدث خطأ ما'

      toast(
        errorMessage ?? 'حدثت مشكلة أثناء إتمام عملية شراء الأسهم، حاول مرة أخرى لاحقا',
        {
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
        }
      )
    } finally {
      setTimeout(() => push(`/profile/investments`), DEFAULT_DURATION)
    }
  }

  return !session ? (
    replace('/')
  ) : (
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
                    {userData?.userEmail ?? (
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
                    {userData?.userName ?? (
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
                    {userData?.userPhone ?? (
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
                      className='p-4 border border-gray-600 rounded-lg cursor-pointer dark:border dark:bg-gray-800 w-72'
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
                  <PaymentMetods
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    totalPaymentAmount={stockItems?.totalPaymentAmount ?? 0}
                  />
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
          <a
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
          </a>
        </div>
      </main>
    </Layout>
  )
}

'use client'

import { DEFAULT_DURATION } from '@/data/constants'
import { getAuth } from '@/lib/actions/auth'
import { validatePasswordStrength } from '@/lib/utils'
import type { UserLoggedInProps, UserProps, getAuthType } from '@/types'
import { ReloadIcon } from '@radix-ui/react-icons'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CardWrapper } from '@/components/auth/card-wrapper'
import FormMessage from '@/components/custom/FormMessage'
import Layout from '@/components/custom/Layout'
import { Error, Success } from '@/components/icons/Status'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { LoadingPage } from '@/components/custom/Loading'
import NotFound from '@/app/not-found'

export default function WithDrawPage() {
  const { data: session }: { data: UserLoggedInProps } = useSession()

  // Form States
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [isDoneSubmitting, setIsDoneSubmitting] = useState<boolean>(false)

  const { replace } = useRouter()
  const redirectUrl = useSearchParams().get('callbackUrl')

  // Errors States
  const [emailOrPhoneError, setWithdrawAmountError] = useState('')

  // Refetch the session after sign in
  useEffect(() => {
    async function refetchSession() {
      const { loading, userStockLimit, userType } = await getAuth()

      loading
        ? setIsDoneSubmitting(false)
        : localStorage.setItem('shms_stock_limit', JSON.stringify(userStockLimit))

      loading
        ? setIsDoneSubmitting(false)
        : localStorage.setItem('shms_type', JSON.stringify(userType))
    }
    refetchSession()
  }, [session])

  const handelWithDrawPageForm = async (e: {
    target: any
    key?: string
    preventDefault: () => void
  }) => {
    // don't refresh the page
    e.preventDefault()

    // check if the form is valid
    if (withdrawAmount === '') {
      resetFormErrors()
      setWithdrawAmountError('يرجى إدخال الرصيد الذي ترغب في سحبه')
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)

        const results = await signIn('credentials', {
          redirect: false,
          withdrawAmount: withdrawAmount.trim().toLowerCase()
        })

        // if the status is 400 or 401 show error message
        if (results?.status === 400 || results?.status === 401) {
          toast(`عفواً، بيانات الدخول غير صحيحة يرجى التأكد من ثم المحاولة مرة أخرى!`, {
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
          setIsSubmittingForm(false)
        } else {
          toast('تم تسجيل دخولك بنجاح', {
            icon: <Success />,
            position: 'bottom-center',
            className: 'text-right select-none rtl',
            duration: DEFAULT_DURATION / 3,
            style: {
              backgroundColor: '#F0FAF0',
              color: '#367E18',
              border: '1px solid #367E18',
              gap: '1.5rem',
              textAlign: 'justify'
            }
          })

          if (redirectUrl) {
            setTimeout(() => {
              replace(redirectUrl)
            }, 200)
          }
        }
      } catch (error: any) {
        const message: UserProps['message'] =
          error?.response?.data?.message ?? 'حدث خطأ ما'
        //handle error, show notification using Shadcn notifcation
        toast(message ?? JSON.stringify(error), {
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
        console.error('Error', error)
      }
    }
  }

  /**
   * Reset all form errors
   */
  function resetFormErrors() {
    setWithdrawAmountError('')
  }

  const { userType, withdrawableAmount }: getAuthType =
    typeof window !== 'undefined' &&
    JSON.parse(String(localStorage.getItem('shms_user_data')))

  return !session && userType !== 'admin' ? (
    <NotFound />
  ) : session?.user ? (
    <LoadingPage />
  ) : (
    <Layout>
      <section className='w-full h-screen min-h-screen mt-32 mb-24'>
        <CardWrapper
          heading='سحب الرصيد'
          backButtonLabel='العودة للوحة التحكم'
          backButtonHref='/profile/investments'
          className='md:w-[50rem] mx-auto'
        >
          <form
            className='container w-full min-w-max'
            dir='rtl'
            onSubmit={e => handelWithDrawPageForm(e)}
          >
            {emailOrPhoneError && <FormMessage error>{emailOrPhoneError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='withdraw-amount'
                  className='block pl-4 mb-1 font-bold text-gray-500 select-none md:text-right md:mb-0'
                >
                  الرصيد الذي ترغب في سحبه
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  onChange={e => setWithdrawAmount(e.target.value)}
                  id='withdraw-amount'
                  type='number'
                  inputMode='numeric'
                  placeholder='يرجى إدخال الرصيد الذي ترغب في سحبه'
                  autoFocus
                  autoSave='on'
                />
                <small className='block mt-1 text-xs text-gray-500 select-none md:text-right'>
                  تستطيع سحب الرصيد حتى مبلغ
                  <strong className='mr-2' data-price>
                    {withdrawableAmount}
                  </strong>
                </small>
              </div>
            </div>

            {/* Submit Button */}
            <div className='md:flex md:items-center'>
              <Button
                disabled={isDoneSubmitting}
                type='submit'
                className={`shadow w-full bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold${
                  isDoneSubmitting ? ' cursor-not-allowed opacity-50' : ''
                }`}
              >
                {isSubmittingForm ? (
                  <>
                    <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                    جاري تنفيذ العملية ...
                  </>
                ) : isDoneSubmitting ? (
                  <>
                    <Success />
                    تم تنفيذ العملية .. جاري تحويلك
                  </>
                ) : (
                  'طلب عملية سحب'
                )}
              </Button>
            </div>
          </form>
        </CardWrapper>
      </section>
    </Layout>
  )
}

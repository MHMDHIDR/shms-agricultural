'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { CardWrapper } from '@/components/auth/card-wrapper'
import FormMessage from '@/components/custom/FormMessage'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Error, Success } from '@/components/icons/Status'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import type { UserProps, getAuthType } from '@/types'
import { TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

export default function NewWithdraw() {
  const { userId, withdrawableAmount }: getAuthType =
    typeof window !== 'undefined' &&
    JSON.parse(String(localStorage.getItem('shms_user_data')))

  const [withdrawAmountLimit, setWithdrawAmountLimit] = useState<
    getAuthType['withdrawableAmount'] | null
  >(null)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmittingDone: false
  })
  const { replace } = useRouter()

  useEffect(() => {
    setWithdrawAmountLimit(withdrawableAmount)
  }, [withdrawableAmount])

  // Errors States
  const [withdrawAmountError, setWithdrawAmountError] = useState('')

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
        setFormStatus({ ...formStatus, isSubmitting: true })

        const withdrawFromBalance: { data: UserProps } = await axios.post(
          `${API_URL}/users/withdrawAmount/${userId}`,
          { withdrawAmount }
        )
        //getting response from backend
        const { userWithdrawnBalance, message } = withdrawFromBalance.data

        // make sure to view the response from the data
        userWithdrawnBalance === 1 &&
          toast(message, {
            icon: <Info className='text-blue-300' />,
            position: 'bottom-center',
            className: 'text-right select-none rtl',
            duration: DEFAULT_DURATION,
            style: {
              backgroundColor: '#F0FAF0',
              color: '#367E18',
              border: '1px solid #367E18',
              gap: '1.5rem',
              textAlign: 'justify'
            }
          })
        setTimeout(() => replace(`/profile/investments`), DEFAULT_DURATION)
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
      } finally {
        setFormStatus({ ...formStatus, isSubmitting: false, isSubmittingDone: true })
      }
    }
  }

  /**
   * Reset all form errors
   */
  function resetFormErrors() {
    setWithdrawAmountError('')
  }

  return (
    <TabsContent value='new_withdraw'>
      <CardWrapper
        heading='سحب الرصيد'
        backButtonLabel='العودة للوحة التحكم'
        backButtonHref='/profile/investments'
        className='w-full mx-auto'
      >
        <form dir='rtl' onSubmit={e => handelWithDrawPageForm(e)}>
          {withdrawAmountError && <FormMessage error>{withdrawAmountError}</FormMessage>}
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
                min={1}
                max={withdrawAmountLimit ?? 0}
                autoFocus
                required
              />
              <small className='flex items-center mt-1 text-xs text-gray-500 select-none md:text-right'>
                تستطيع سحب الرصيد حتى مبلغ
                <strong className='inline-flex justify-center mr-2' data-price>
                  {!withdrawAmountLimit ? (
                    <Skeleton className='inline-block w-8 h-4 bg-gray-600' />
                  ) : (
                    withdrawAmountLimit
                  )}
                </strong>
              </small>
            </div>
          </div>

          {/* Submit Button */}
          <div className='md:flex md:items-center'>
            <Button
              disabled={formStatus.isSubmitting}
              type='submit'
              className={`shadow w-full bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold${
                formStatus.isSubmitting ? ' cursor-progress opacity-50' : ''
              }`}
            >
              {formStatus.isSubmitting ? (
                <>
                  <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                  جاري تنفيذ العملية ...
                </>
              ) : formStatus.isSubmittingDone ? (
                <>
                  <Success className='ml-2' />
                  تم تنفيذ العملية .. جاري تحويلك
                </>
              ) : (
                'طلب عملية سحب'
              )}
            </Button>
          </div>
        </form>
      </CardWrapper>
    </TabsContent>
  )
}

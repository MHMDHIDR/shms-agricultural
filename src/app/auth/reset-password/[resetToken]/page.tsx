'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { CardWrapper } from '@/components/auth/card-wrapper'
import FormMessage from '@/components/custom/FormMessage'
import { Button } from '@/components/ui/button'
import { Error, Success } from '@/components/icons/Status'
import { validatePasswordStrength } from '@/lib/utils'
import { ReloadIcon } from '@radix-ui/react-icons'
import { validateUUID } from '@/lib/utils'
import { toast } from 'sonner'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import type { UserProps } from '@/types'
import Layout from '@/components/custom/Layout'

const ForgotPasswordPage = ({
  params: { resetToken }
}: {
  params: { resetToken: string }
}) => {
  const HEADING = 'إنشاء كلمة مرور جديدة'

  const [password, setPassword] = useState('')
  const [passError, setPassError] = useState('')
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false)
  const [isDoneSubmitting, setIsDoneSubmitting] = useState<boolean>(false)

  const { replace } = useRouter()

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  function resetFormErrors() {
    setPassError('')
  }

  const handelResetForm = async (e: {
    target: any
    key?: string
    preventDefault: () => void
  }) => {
    // don't refresh the page
    e.preventDefault()

    if (password === '') {
      setPassError('الرجاء إدخال كلمة المرور الجديدة')
      return
    } else if (!validatePasswordStrength(password)) {
      setPassError(
        'كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
      )
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)

        const resetPass = await axios.post(`${API_URL}/users/resetpass`, {
          password,
          resetToken
        })
        //getting response from backend
        const { data }: { data: UserProps } = resetPass

        // make sure to view the response from the data
        data.newPassSet === 1
          ? toast(data.message, {
              icon: <Success />,
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
          : toast('حدث خطأ ما، الرجاء المحاولة مرة أخرى', {
              icon: <Error />,
              position: 'bottom-center',
              className: 'text-right select-none rtl',
              duration: DEFAULT_DURATION,
              style: {
                backgroundColor: '#FFF0F0',
                color: '#BE2A2A',
                border: '1px solid #BE2A2A',
                gap: '1.5rem',
                textAlign: 'justify'
              }
            })

        setTimeout(() => replace(`/auth/signin`), DEFAULT_DURATION)
      } catch (error: any) {
        const message: UserProps['message'] =
          error?.response.data.newPassSet === 0
            ? 'عفواً! حدث خطأ ما حاول مرة أخرى'
            : error?.response.data.message
        //handle error, show notification using Shadcn notifcation
        toast(message, {
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
        setIsDoneSubmitting(true)
      }
    }
  }

  return !validateUUID(resetToken) ? null : (
    <Layout>
      <section className='min-h-screen h-screen mt-64 md:mt-[25rem] mb-24'>
        <CardWrapper
          heading={HEADING}
          backButtonLabel='الصفحة الرئيسية'
          backButtonHref='/'
          className='md:w-[50rem]'
        >
          <form
            className='container w-full min-w-max'
            dir='rtl'
            onSubmit={e => handelResetForm(e)}
          >
            {passError && <FormMessage error>{passError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='password'
                  className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  كلمة المرور
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  id='password'
                  onChange={handlePasswordChange}
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='password'
                  placeholder='******'
                />
              </div>
            </div>

            <div className='md:flex md:items-center'>
              <div className='md:w-1/3'></div>
              <div className='md:w-2/3'>
                <Button
                  type='submit'
                  disabled={isDoneSubmitting}
                  className={`shadow w-full bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold ${
                    isDoneSubmitting ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  {isSubmittingForm ? (
                    <>
                      <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
                      جاري الإرسال
                    </>
                  ) : isDoneSubmitting ? (
                    <>
                      <Success />
                      تم إستعادة كلمة المرور
                    </>
                  ) : (
                    'استعادة كلمة المرور'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardWrapper>
      </section>
    </Layout>
  )
}

export default ForgotPasswordPage

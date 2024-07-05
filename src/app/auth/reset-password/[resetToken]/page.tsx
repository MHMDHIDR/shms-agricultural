'use client'

import { CardWrapper } from '@/components/auth/card-wrapper'
import FormMessage from '@/components/custom/form-message'
import Layout from '@/components/custom/layout'
import { LoadingPage } from '@/components/custom/loading'
import { Error, Success } from '@/components/icons/Status'
import { EyeClosedIcon, ReloadIcon } from '@radix-ui/react-icons'
import { EyeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import { validatePasswordStrength, validateUUID } from '@/libs/utils'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import type { UserLoggedInProps } from '@/types'
import type { Users } from '@prisma/client'

const ForgotPasswordPage = ({
  params: { resetToken }
}: {
  params: { resetToken: string }
}) => {
  const { data: session }: { data: UserLoggedInProps } = useSession()
  const HEADING = 'إنشاء كلمة مرور جديدة'

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [passError, setPassError] = useState('')
  const [passConfirmError, setPassConfirmError] = useState('')

  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false)
  const [isDoneSubmitting, setIsDoneSubmitting] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { replace } = useRouter()

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const handleConfrimPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
  }

  function resetFormErrors() {
    setPassError('')
    setPassConfirmError('')
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
    } else if (confirmPassword !== password) {
      setPassConfirmError('كلمة المرور يجب أن تتطابق مع كلمة المرور الجديدة')
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)

        const resetPass = await axios.post(`${API_URL}/users/resetpass`, {
          password,
          resetToken
        })
        //getting response from backend
        const { data }: { data: Users } = resetPass

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
        const message: Users['message'] =
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

  return session?.expires ? (
    replace('/')
  ) : session?.user ? (
    <LoadingPage />
  ) : !validateUUID(resetToken) ? null : (
    <Layout>
      <section className='w-full h-screen min-h-screen mt-32 mb-24'>
        <CardWrapper
          heading={HEADING}
          backButtonLabel='تسجيل الدخول'
          backButtonHref='/auth/signin'
          className='md:w-[50rem] mx-auto'
        >
          <form
            className='container w-full min-w-max'
            dir='rtl'
            onSubmit={e => handelResetForm(e)}
            noValidate
          >
            <FormMessage className='select-none text-xxs' info>
              كلمة المرور يجب ان تكون على الاقل من 8 احرف وتحتوي على حرف كبير وحرف صغير
              ورقم وحرف خاص مثل x@xxxxxxxx
            </FormMessage>

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
              <div className='relative md:w-2/3'>
                <input
                  id='password'
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  onChange={handlePasswordChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder='******'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(prevShowPassword => !prevShowPassword)}
                  className='absolute top-2 left-6'
                >
                  {showPassword ? <EyeIcon /> : <EyeClosedIcon className='w-5 h-5' />}
                </button>
              </div>
            </div>

            {passConfirmError && <FormMessage error>{passConfirmError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='confirmPassword'
                  className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  تأكيد كلمة المرور
                </label>
              </div>
              <div className='relative md:w-2/3'>
                <input
                  id='confirmPassword'
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  onChange={handleConfrimPasswordChange}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='******'
                />
                <button
                  type='button'
                  onClick={() =>
                    setShowConfirmPassword(
                      prevShowConfirmPassword => !prevShowConfirmPassword
                    )
                  }
                  className='absolute top-2 left-6'
                >
                  {showConfirmPassword ? (
                    <EyeIcon />
                  ) : (
                    <EyeClosedIcon className='w-5 h-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className='md:flex md:items-center'>
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
          </form>
        </CardWrapper>
      </section>
    </Layout>
  )
}

export default ForgotPasswordPage

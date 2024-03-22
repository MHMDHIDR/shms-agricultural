'use client'

import { DEFAULT_DURATION } from '@/data/constants'
import { validatePasswordStrength, redirect as redirectPage } from '@/lib/utils'
import type { UserLoggedInProps, UserProps } from '@/types'
import { EyeClosedIcon, ReloadIcon } from '@radix-ui/react-icons'
import { EyeIcon } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CardWrapper } from '@/components/auth/card-wrapper'
import FormMessage from '@/components/custom/FormMessage'
import Layout from '@/components/custom/Layout'
import { Error, Success } from '@/components/icons/Status'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { getAuth } from '@/lib/actions/auth'
// import { LoadingPage } from '@/components/custom/Loading'

const SigninPage = () => {
  const { data: session }: { data: UserLoggedInProps } = useSession()

  // Form States
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [isDoneSubmitting, _setIsDoneSubmitting] = useState<boolean>(false)
  const [userType, setUserType] = useState<UserProps['shms_user_account_type']>('user')

  useEffect(() => {
    const getUserData = async () => {
      const { userType, loading } = await getAuth()
      if (loading) return

      setUserType(userType)
    }

    getUserData()
  }, [session])

  const redirectUrl = useSearchParams().get('callbackUrl')

  // Errors States
  const [emailOrPhoneError, setEmailOrPhoneError] = useState('')
  const [passError, setPassError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword)
  }

  function resetFormErrors() {
    setEmailOrPhoneError('')
    setPassError('')
  }

  const handelSigninForm = async (e: {
    target: any
    key?: string
    preventDefault: () => void
  }) => {
    // don't refresh the page
    e.preventDefault()

    // check if the form is valid
    if (emailOrPhone === '') {
      resetFormErrors()
      setEmailOrPhoneError('الرجاء التأكد من إدخال رقم الهاتف أو البريد الالكتروني')
    } else if (password === '') {
      resetFormErrors()
      setPassError('الرجاء التأكد من إدخال كلمة المرور')
    } else if (!validatePasswordStrength(password)) {
      resetFormErrors()
      setEmailOrPhoneError('الرجاء التأكد من صحة كلمة المرور')
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)

        const results = await signIn('credentials', {
          redirect: false,
          emailOrPhone: emailOrPhone.trim().toLowerCase(),
          password
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
            redirectPage(redirectUrl, 0)
          }
        }
      } catch (error: any) {
        console.error('Error', error)

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
      }
    }
  }

  console.log('session --> ', session)

  console.log('userType --> ', userType)

  return session ? (
    redirect('/')
  ) : (
    //: session?.user ? (  <LoadingPage /> )
    <Layout>
      <section className='w-full h-screen min-h-screen mt-32 mb-24'>
        <CardWrapper
          headerLabel='مرحبا بك'
          backButtonLabel='إنشاء حساب جديد'
          backButtonHref='/auth/signup'
          className='md:w-[50rem] mx-auto'
        >
          <form
            className='container w-full min-w-max'
            dir='rtl'
            onSubmit={e => handelSigninForm(e)}
          >
            {emailOrPhoneError && <FormMessage error>{emailOrPhoneError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                  البريد الالكتروني او رقم الهاتف
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  onChange={e => setEmailOrPhone(e.target.value)}
                  id='inline-email'
                  type='text'
                  placeholder='رقم الهاتف أو البريد الالكتروني'
                />
              </div>
            </div>

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
              <div className='md:w-2/3 relative'>
                <input
                  id='password'
                  onChange={handlePasswordChange}
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  placeholder='******'
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute top-2 left-6'
                >
                  {showPassword ? <EyeIcon /> : <EyeClosedIcon className='w-5 h-5' />}
                </button>
              </div>
            </div>

            <div className='flex justify-between w-full my-4'>
              <Link
                href='/auth/forgot-password'
                className='text-gray-500 transition-colors hover:text-gray-700'
              >
                نسيت كلمة المرور؟
              </Link>
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
                    جاري تسجيل الدخول ...
                  </>
                ) : isDoneSubmitting ? (
                  <>
                    <Success />
                    تم تسجيل الدخول .. جاري تحويلك
                  </>
                ) : (
                  'دخول'
                )}
              </Button>
            </div>
          </form>
        </CardWrapper>
      </section>
    </Layout>
  )
}

export default SigninPage

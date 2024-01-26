'use client'

import { ChangeEvent, useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ReloadIcon } from '@radix-ui/react-icons'
import { DEFAULT_DURATION } from '@/data/constants'
import { getAuth } from '@/lib/actions/auth'
import { validatePasswordStrength } from '@/lib/utils'
import type { UserProps } from '@/types'

import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { Error, Success } from '@/components/icons/Status'
import FormMessage from '@/components/custom/FormMessage'
import Layout from '@/components/custom/Layout'

const SigninPage = () => {
  // Form States
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [isDoneSubmitting, setIsDoneSubmitting] = useState<boolean>(false)

  const { replace } = useRouter()
  const redirectUrl = useSearchParams().get('callbackUrl')

  // Errors States
  const [emailOrPhoneError, setEmailOrPhoneError] = useState('')
  const [passError, setPassError] = useState('')

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const blurEmailOrPhone = (emailOrPhone: string) => {
    if (emailOrPhone === '') {
      setEmailOrPhoneError('الرجاء التأكد من صحة البيانات المدخلة')
    } else {
      setEmailOrPhoneError('')
    }
  }

  const blurPassword = () => {
    if (!validatePasswordStrength(password)) {
      setPassError(
        'كلمة المرور يجب ان تكون على الاقل 8 احرف وتحتوي على حرف كبير وحرف صغير ورقم وحرف خاص مثل !@#$%^&*()'
      )
    } else {
      setPassError('')
    }
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
          // check is auth from useSession
          const { userType, loading } = await getAuth()
          loading ? setIsDoneSubmitting(false) : setIsDoneSubmitting(true)

          const REDIRECT_TO = redirectUrl ?? userType === 'admin' ? '/dashboard' : '/'

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
          //redirect to the home page if sign in successfully
          setTimeout(() => replace(REDIRECT_TO), DEFAULT_DURATION / 2)
        }
      } catch (error: any) {
        const message: UserProps['message'] =
          error?.response?.data?.message ?? 'حدث خطأ ما'
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
        console.error('Error', error)
      }
    }
  }

  /**
   * Reset all form errors
   */
  function resetFormErrors() {
    setEmailOrPhoneError('')
    setPassError('')
  }

  return (
    <Layout>
      <section className='min-h-screen h-screen mt-64 md:mt-[25rem] mb-24'>
        <CardWrapper
          headerLabel='مرحبا بك'
          backButtonLabel='إنشاء حساب جديد'
          backButtonHref='/auth/signup'
          className='md:w-[50rem]'
        >
          <form
            className='w-full min-w-max container'
            dir='rtl'
            onSubmit={e => handelSigninForm(e)}
          >
            {emailOrPhoneError && <FormMessage error>{emailOrPhoneError}</FormMessage>}
            <div className='md:flex md:items-center mb-6'>
              <div className='md:w-1/3'>
                <label className='block text-gray-500  font-bold md:text-right mb-1 md:mb-0 pl-4'>
                  البريد الالكتروني او رقم الهاتف
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                  onBlur={e => blurEmailOrPhone(e.target.value)}
                  onChange={e => setEmailOrPhone(e.target.value)}
                  id='inline-email'
                  type='text'
                  placeholder='رقم الهاتف أو البريد الالكتروني'
                />
              </div>
            </div>

            {passError && <FormMessage error>{passError}</FormMessage>}
            <div className='md:flex md:items-center mb-6'>
              <div className='md:w-1/3'>
                <label
                  htmlFor='password'
                  className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0'
                >
                  كلمة المرور
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  id='password'
                  onChange={handlePasswordChange}
                  onBlur={blurPassword}
                  className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                  type='password'
                  placeholder='******'
                />
              </div>
            </div>

            <div className='w-full flex justify-between my-4'>
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
                    <ReloadIcon className='ml-3 h-4 w-4 animate-spin' />
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

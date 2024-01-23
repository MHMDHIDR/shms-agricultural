'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ReloadIcon } from '@radix-ui/react-icons'
import { DEFAULT_DURATION } from '@/data/constants'
import { validatePasswordStrength } from '@/lib/utils'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { Error, Success } from '@/components/icons/Status'
import FormMessage from '@/components/custom/FormMessage'
import { CardTitle } from '@/components/ui/card'
import type { UserProps } from '@/types'

const Contact = () => {
  // Form States
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password /*setPassword*/] = useState('')
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const { replace } = useRouter()
  const redirectUrl = useSearchParams().get('callbackUrl')

  // Errors States
  const [emailOrPhoneError, setEmailOrPhoneError] = useState('')
  const [passError, setPassError] = useState('')

  const blurEmailOrPhone = (emailOrPhone: string) => {
    if (emailOrPhone === '') {
      setEmailOrPhoneError('الرجاء التأكد من صحة البيانات المدخلة')
    } else {
      setEmailOrPhoneError('')
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
        } else {
          // data.loggedIn === 1
          toast('تم تسجيل دخولك بنجاح', {
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

          //redirect to the home page if sign in successfully
          setTimeout(() => replace(redirectUrl ?? `/`), DEFAULT_DURATION)
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
      } finally {
        setIsSubmittingForm(false)
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
    <section className='min-h-screen h-screen mt-16 md:mt-52 mb-52 p-4 flex justify-center items-center'>
      <CardWrapper
        heading='تواصل معنا'
        headerLabel=''
        backButtonLabel=''
        backButtonHref='/auth/signup'
        className='w-full md:max-w-2xl '
      >
        <form
          className='w-full md:max-w-2xl'
          dir='rtl'
          onSubmit={e => handelSigninForm(e)}
        >
          {emailOrPhoneError && <FormMessage error>{emailOrPhoneError}</FormMessage>}
          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                style={{ textAlign: 'right' }}
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pl-4'
              >
                البريد الالكتروني او رقم الهاتف
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                className='bg-gray-200 dark:bg-gray-800 appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
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
                style={{ textAlign: 'right' }}
                htmlFor='password'
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0'
              >
                العنوان
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                //id='password'
                //onChange={handlePasswordChange}
                //onBlur={blurPassword}
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                type='text'
                placeholder='الدوحة - قطر'
              />
            </div>
          </div>

          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                style={{ textAlign: 'right' }}
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pl-4'
              >
                الرسالة
              </label>
            </div>
            <div className='md:w-2/3'>
              <textarea
                className='bg-gray-200 resize-y min-h-64 max-h-96 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                id='w3review'
                name='w3review'
                rows={10}
                cols={50}
                placeholder='اكتب رسالتك هنا'
              />
            </div>
          </div>

          <div className='w-full flex justify-between my-4'></div>

          {/* Submit Button */}
          <div className='md:flex md:items-center'>
            <Button
              disabled={isSubmittingForm}
              type='submit'
              className='shadow w-full bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold'
            >
              {isSubmittingForm ? (
                <>
                  <ReloadIcon className='ml-3 h-4 w-4 animate-spin' />
                  جاري الارسال ...
                </>
              ) : (
                'ارسال'
              )}
            </Button>
          </div>

          <div style={{ margin: 20, justifyContent: 'center', alignItems: 'center' }}>
            <div className='flex justify-center items-center my-8 space-x-4'>
              <Link
                className='hover:-translate-y-2 transition-transform'
                href={'https://facebook.com/'}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-7 w-7'
                  fill='currentColor'
                  style={{ color: '#1877f2', margin: 10 }}
                  viewBox='0 0 24 24'
                  // onClick={()=>window.location.href='https://facebook.com/'}
                >
                  <path d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' />
                </svg>
              </Link>

              <Link
                className='hover:-translate-y-2 transition-transform'
                href={'https://facebook.com/'}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-7 w-7'
                  fill='currentColor'
                  style={{ color: '#c13584', margin: 10 }}
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
              </Link>

              <Link
                className='hover:-translate-y-2 transition-transform'
                href={'https://facebook.com/'}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-7 w-7'
                  fill='currentColor'
                  style={{ color: '#ff0000', margin: 10 }}
                  viewBox='0 0 24 24'
                >
                  <path d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z' />
                </svg>
              </Link>

              <Link
                className='hover:-translate-y-2 transition-transform'
                href={'https://facebook.com/'}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-7 w-7'
                  fill='currentColor'
                  style={{ color: '#1da1f2', margin: 10 }}
                  viewBox='0 0 24 24'
                >
                  <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
                </svg>
              </Link>
            </div>
          </div>
        </form>

        <div>
          <CardTitle className='my-4'>أو على البريد الالكتروني</CardTitle>
          <Link href={'mailto:info@shmsagricultural.com'} className='text-gray-700'>
            info@shmsagricultural.com
          </Link>
        </div>
      </CardWrapper>
    </section>
  )
}
export default Contact

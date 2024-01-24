'use client'

import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Info } from 'lucide-react'
import { CardWrapper } from '@/components/auth/card-wrapper'
import FormMessage from '@/components/custom/FormMessage'
import { Button } from '@/components/ui/button'
import { Error, Success } from '@/components/icons/Status'
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YouTubeIcon
} from '@/components/icons/Socials'

import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import type { UserProps, emailProps } from '@/types'

const Contact = () => {
  // Form States
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')

  const [emailOrPhoneError, setEmailOrPhoneError] = useState('')

  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [isDoneSubmitting, setIsDoneSubmitting] = useState<boolean>(false)

  const { replace } = useRouter()

  function resetFormErrors() {
    setEmailOrPhoneError('')
  }

  const blurEmailOrPhone = (emailOrPhone: string) => {
    if (emailOrPhone === '') {
      setEmailOrPhoneError('الرجاء التأكد من صحة البيانات المدخلة')
    } else {
      setEmailOrPhoneError('')
    }
  }

  const handelContact = async (e: {
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
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)

        const sentMail: { data: emailProps } = await axios.post(
          `${API_URL}/users/contact`,
          { emailOrPhone, address, message }
        )
        //getting response from backend
        const { data: sentMailData } = sentMail

        // make sure to view the response from the data
        sentMailData.mailSent === 1 &&
          toast(
            'تم إرسال بريد الكتروني لتأكيد التسجيل ، الرجاء إتباع التعليمات في البريد لتفعيل حسابك 👍🏼',
            {
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
            }
          )

        setTimeout(() => replace(`/`), DEFAULT_DURATION)
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
        setIsDoneSubmitting(true)
      }
    }
  }

  return (
    <section className='min-h-screen h-screen mt-16 md:mt-52 mb-52 p-4 flex justify-center items-center'>
      <CardWrapper
        heading='تواصل معنا'
        headerLabel=''
        backButtonLabel='أو على بريدنا الالكتروني: info@shmsagricultural.com'
        backButtonHref='mailto:info@shmsagricultural.com'
        backButtonTarget='_blank'
        className='w-full md:max-w-2xl rtl'
      >
        <form className='w-full md:max-w-2xl' dir='rtl' onSubmit={e => handelContact(e)}>
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

          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                style={{ textAlign: 'right' }}
                htmlFor='address'
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0'
              >
                العنوان
              </label>
            </div>
            <div className='md:w-2/3'>
              <input
                className='bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                type='text'
                id='address'
                onChange={e => setAddress(e.target.value)}
                placeholder='الدوحة - قطر'
              />
            </div>
          </div>

          <div className='md:flex md:items-center mb-6'>
            <div className='md:w-1/3'>
              <label
                style={{ textAlign: 'right' }}
                htmlFor='message'
                className='block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pl-4'
              >
                الرسالة
              </label>
            </div>
            <div className='md:w-2/3'>
              <textarea
                id='message'
                className='bg-gray-200 resize-y min-h-64 max-h-96 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
                onChange={e => setMessage(e.target.value)}
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
              className={`shadow w-full bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold${
                isDoneSubmitting ? ' cursor-not-allowed opacity-50' : ''
              }`}
            >
              {isSubmittingForm ? (
                <>
                  <ReloadIcon className='ml-3 h-4 w-4 animate-spin' />
                  جاري الارسال ...
                </>
              ) : isDoneSubmitting ? (
                <>
                  <Success />
                  وصلتنا رسالتك 😄
                </>
              ) : (
                'ارسال'
              )}
            </Button>
          </div>

          <div style={{ margin: 20, justifyContent: 'center', alignItems: 'center' }}>
            <div className='flex justify-center items-center gap-x-10'>
              <Link
                className='hover:-translate-y-1 transition-transform'
                href='https://facebook.com'
                target='_blank'
              >
                <FacebookIcon />
              </Link>

              <Link
                className='hover:-translate-y-1 transition-transform'
                href='https://instagram.com'
                target='_blank'
              >
                <InstagramIcon />
              </Link>

              <Link
                className='hover:-translate-y-1 transition-transform'
                href='https://youtube.com'
                target='_blank'
              >
                <YouTubeIcon />
              </Link>

              <Link
                className='hover:-translate-y-1 transition-transform'
                href='https://twitter.com'
                target='_blank'
              >
                <TwitterIcon />
              </Link>
            </div>
          </div>
        </form>
      </CardWrapper>
    </section>
  )
}
export default Contact

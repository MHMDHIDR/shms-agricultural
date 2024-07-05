'use client'

import { CardWrapper } from '@/components/auth/card-wrapper'
import FormMessage from '@/components/custom/form-message'
import { Error, Success } from '@/components/icons/status'
import { Button } from '@/components/ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import Layout from '@/components/custom/layout'
import { API_URL, DEFAULT_DURATION } from '@/data/constants'
import type { emailProps } from '@/types'
import type { Users } from '@prisma/client'

const Contact = () => {
  // Form States
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')

  const [emailOrPhoneError, setEmailOrPhoneError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [messageError, setMessageError] = useState('')

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
    } else if (address === '') {
      resetFormErrors()
      setAddressError('الرجاء التأكد من إدخال العنوان')
    } else if (message === '') {
      resetFormErrors()
      setMessageError('الرجاء التأكد من إدخال الرسالة')
    } else {
      try {
        resetFormErrors()
        setIsSubmittingForm(true)

        const sentMail: { data: emailProps } = await axios.post(`${API_URL}/contact`, {
          emailOrPhone,
          address,
          message
        })
        //getting response from backend
        const { data: sentMailData } = sentMail

        // make sure to view the response from the data
        sentMailData.mailSent === 1 &&
          toast(sentMailData.message, {
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

        setTimeout(() => replace(`/`), DEFAULT_DURATION)
      } catch (error: any) {
        const message: Users['message'] = error?.response?.data?.message ?? 'حدث خطأ ما'
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
    <Layout>
      <section className='flex items-center justify-center h-screen min-h-screen p-4 mt-4 mb-16 md:mt-16'>
        <CardWrapper
          heading='تواصل معنا'
          headerLabel=''
          backButtonLabel={
            <span className='underline-hover'>
              أو على بريدنا الالكتروني: <strong>info@shmsagricultural.com</strong>
            </span>
          }
          backButtonHref='mailto:info@shmsagricultural.com'
          backButtonTarget='_blank'
          className='w-full md:max-w-2xl rtl'
        >
          <form
            className='w-full md:max-w-2xl'
            dir='rtl'
            onSubmit={e => handelContact(e)}
          >
            {emailOrPhoneError && <FormMessage error>{emailOrPhoneError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  style={{ textAlign: 'right' }}
                  className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  البريد الالكتروني او رقم الهاتف
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300  focus:outline-none focus:bg-white focus:border-purple-500'
                  onBlur={e => blurEmailOrPhone(e.target.value)}
                  onChange={e => setEmailOrPhone(e.target.value)}
                  id='inline-email'
                  type='text'
                  placeholder='رقم الهاتف أو البريد الالكتروني'
                />
              </div>
            </div>

            {addressError && <FormMessage error>{addressError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  style={{ textAlign: 'right' }}
                  htmlFor='address'
                  className='block mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  العنوان
                </label>
              </div>
              <div className='md:w-2/3'>
                <input
                  className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  type='text'
                  id='address'
                  onChange={e => setAddress(e.target.value)}
                  placeholder='الدوحة - قطر'
                />
              </div>
            </div>

            {messageError && <FormMessage error>{messageError}</FormMessage>}
            <div className='mb-6 md:flex md:items-center'>
              <div className='md:w-1/3'>
                <label
                  style={{ textAlign: 'right' }}
                  htmlFor='message'
                  className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'
                >
                  الرسالة
                </label>
              </div>
              <div className='md:w-2/3'>
                <textarea
                  id='message'
                  className='w-full px-4 py-2 leading-relaxed text-gray-700 bg-gray-200 border border-gray-200 rounded resize-y min-h-64 max-h-96 dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                  onChange={e => setMessage(e.target.value)}
                  rows={10}
                  cols={50}
                  placeholder='اكتب رسالتك هنا'
                />
              </div>
            </div>

            <div className='flex justify-between w-full my-4'></div>

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
                    <ReloadIcon className='w-4 h-4 ml-3 animate-spin' />
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
          </form>
        </CardWrapper>
      </section>
    </Layout>
  )
}
export default Contact

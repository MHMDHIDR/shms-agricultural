'use client'

import Image from 'next/image'
// import axios from 'axios'
// import type { ProjectProps } from '@/types'
// import { API_URL } from '@/data/constants'
import Layout from '@/components/custom/Layout'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import PaymentMetods from '@/components/custom/PaymentMetods'

export default function PersonalData({
  params: { id: projectId /*, slug*/ }
}: {
  params: { id: string /*, slug: string*/ }
}) {
  // const {
  //   data: { project: _اوبجيكت_المشروع }
  // }: { data: { project: ProjectProps } } = await axios.get(
  //   `${API_URL}/projects/get/${projectId}`
  // )

  // console.log(_اوبجيكت_المشروع)

  return (
    <Layout>
      <main className='flex flex-col items-center justify-between min-h-screen sm:p-24'>
        <div dir='rtl' className='flex items-center justify-center w-full'>
          {/* Center the CardWrapper here */}
          <CardWrapper
            heading='البيانات الشخصية'
            //backButtonLabel='لديك حساب بالفعل؟ تسجيل الدخول'
            //backButtonHref='/auth/signin'
          >
            <form
              dir='rtl'
              className='w-full max-w-fit md:m-5'
              // onSubmit={e => handelSignupForm(e)}
              noValidate
            >
              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    البريد الالكتروني
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <input
                    className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                    //   onBlur={e => blurEmailOrPhone(e.target.value)}
                    //   onChange={e => setEmailOrPhone(e.target.value)}
                    //id='inline-email'
                    type='text'
                    placeholder='البريد الالكتروني'
                  />
                </div>
              </div>

              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    الاسم
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <input
                    className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                    //   onBlur={e => blurEmailOrPhone(e.target.value)}
                    //   onChange={e => setEmailOrPhone(e.target.value)}
                    //id='inline-email'
                    type='text'
                    placeholder='الاسم كامل'
                  />
                </div>
              </div>

              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    رقم الهاتف
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <input
                    className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border border-gray-200 rounded appearance-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'
                    //   onBlur={e => blurEmailOrPhone(e.target.value)}
                    //   onChange={e => setEmailOrPhone(e.target.value)}
                    //id='inline-email'
                    type='text'
                    placeholder='رقم الهاتف'
                  />
                </div>
              </div>

              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    صورة المستند
                  </label>
                </div>
                <div className='relative w-32 h-32 '>
                  {/* Example Image */}
                  <Image
                    src='/logo-slogan.png'
                    alt='Your Image Alt Text'
                    style={{ borderRadius: 5 }}
                    width={200}
                    height={200}
                  />
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
                  <PaymentMetods />
                </div>
              </div>
            </form>
          </CardWrapper>
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 20
          }}
        >
          <a href={`/projects/${projectId}/personalData`}>
            <Button style={{ width: 100 }}>تم</Button>
          </a>
        </div>
      </main>
    </Layout>
  )
}

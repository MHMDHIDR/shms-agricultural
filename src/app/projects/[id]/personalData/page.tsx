'use client'

import Image from 'next/image'
import Layout from '@/components/custom/Layout'
import { CardWrapper } from '@/components/auth/card-wrapper'
import PaymentMetods from '@/components/custom/PaymentMetods'
import Modal from '@/components/custom/Modal'
import type { UserLoggedInProps } from '@/types'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function PersonalData({
  params: { id: projectId /*, slug*/ }
}: {
  params: { id: string /*, slug: string*/ }
}) {
  const { data: session }: { data: UserLoggedInProps } = useSession()

  return (
    <Layout>
      <main className='flex flex-col items-center justify-between min-h-screen sm:p-24'>
        <div dir='rtl' className='flex items-center justify-center w-full'>
          {/* Center the CardWrapper here */}
          <CardWrapper heading='البيانات الشخصية'>
            <form dir='rtl' className='w-full max-w-fit md:m-5' noValidate>
              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    البريد الالكتروني
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <span className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'>
                    {session?.token?.user.shms_email}
                  </span>
                </div>
              </div>

              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    الاسم
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <span className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'>
                    {session?.token?.user.fullname}
                  </span>
                </div>
              </div>

              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    رقم الهاتف
                  </label>
                </div>
                <div className='md:w-2/3'>
                  <span className='inline-block w-full px-4 py-2 font-bold leading-tight text-gray-700 bg-white border border-gray-900 rounded select-none dark:bg-gray-800 dark:text-gray-300 focus:outline-none focus:bg-white focus:border-purple-500'>
                    {session?.token?.user.shms_phone}
                  </span>
                </div>
              </div>

              <div className='mb-6 md:flex md:items-center'>
                <div className='md:w-1/3'>
                  <label className='block pl-4 mb-1 font-bold text-gray-500 md:text-right md:mb-0'>
                    صورة المستند
                  </label>
                </div>
                <div className='relative'>
                  <Modal
                    title={`صورة المستند لــ ${session?.token?.user.fullname}`}
                    document={session?.token?.user.shms_doc ?? '/logo-slogan.png'}
                    className='font-bold dark:text-white'
                    asModal
                  >
                    <Image
                      src='/logo-slogan.png'
                      alt='Your Image Alt Text'
                      style={{ borderRadius: 5 }}
                      className='border rounded-lg p-4 border-gray-400 w-72 cursor-pointer'
                      width={350}
                      height={350}
                    />
                  </Modal>
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

        <div className='flex justify-center items-center w-full m-5 space-x-4'>
          <Link href={`/projects/${projectId}/personalData`} className='pressable'>
            تأكيد بيانات الشراء
          </Link>
          <Link href={`/projects/${projectId}/buy`} className='pressable'>
            تعديل البيانات
          </Link>
        </div>
      </main>
    </Layout>
  )
}

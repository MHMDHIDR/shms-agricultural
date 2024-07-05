'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CookieIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '@/libs/utils'

export default function CookieConsent({
  onAcceptCallback = () => {},
  onDeclineCallback = () => {}
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [hide, setHide] = useState(false)

  const accept = () => {
    setIsOpen(false)
    // document.cookie expires in 1 year from now
    document.cookie = `cookieConsent=true; expires=${new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ).toUTCString()}`
    setTimeout(() => {
      setHide(true)
    }, 700)
    onAcceptCallback()
  }

  const decline = () => {
    setIsOpen(false)
    setTimeout(() => {
      setHide(true)
    }, 700)
    onDeclineCallback()
  }

  useEffect(() => {
    try {
      setIsOpen(true)
      if (document.cookie.includes('cookieConsent=true')) {
        setIsOpen(false)
        setTimeout(() => {
          setHide(true)
        }, 700)
      }
    } catch (error) {
      console.error('Error while checking cookie consent: ', error)
    }
  }, [])

  return (
    <div
      className={cn(
        'fixed z-[200] bottom-0 right-0 sm:right-4 sm:bottom-4 w-full sm:max-w-md duration-700 rtl',
        !isOpen
          ? 'transition-[opacity,transform] translate-y-8 opacity-0'
          : 'transition-[opacity,transform] translate-y-0 opacity-100',
        hide && 'hidden'
      )}
    >
      <div className='dark:bg-secondary bg-background rounded-md m-3 border border-border shadow-lg dark:shadow-none'>
        <div className='grid gap-2'>
          <div className='border-b border-border dark:border-background/20 h-14 flex items-center justify-between p-4'>
            <h1 className='text-lg font-medium'>نستخدم ملفات تعريف الإرتباط</h1>
            <CookieIcon className='h-[1.2rem] w-[1.2rem]' />
          </div>
          <div className='p-4'>
            <p className='text-sm leading-loose text-justify'>
              نحن نستخدم ملفات تعريف الإرتباط لضمان حصولك على أفضل تجربة على موقعنا. لمزيد
              من المعلومات حول كيفية استخدامنا لملفات تعريف الإرتباط، يرجى الاطلاع على
              سياسة ملفات تعريف الإرتباط الخاصة بنا.
              <br />
              <br />
              <span className='text-xs'>
                بالضغط على &quot;
                <strong className='opacity-80'>
                  <i>موافق</i>
                </strong>
                &quot;، فإنك توافق على استخدامنا لملفات تعريف الإرتباط.
              </span>
              <br />
              <Link
                href={`/privacy`}
                className='text-blue-500 underline-hover text-xs hover:text-blue-700 dark:hover:text-blue-400'
              >
                إعرف المزيد
              </Link>
            </p>
          </div>
          <div className='flex gap-2 p-4 py-5 border-t border-border dark:bg-background/20'>
            <Button onClick={accept} className='w-full'>
              موافق
            </Button>
            <Button onClick={decline} className='w-full' variant='secondary'>
              رفض
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

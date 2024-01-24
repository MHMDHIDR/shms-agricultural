'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationListItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import MobileNavigation from './MobileNavigation'
import { LogOut } from 'lucide-react'
import { MenuToggler } from './MenuToggler'
import { cn } from '@/lib/utils'
import useEventListener from '@/hooks/useEventListener'
import { APP_URL } from '@/data/constants'

export default function Nav() {
  const { status, data: session } = useSession()

  const isAuth = status === 'authenticated' ? true : false

  const [isOpen, setIsOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [onMobileScreen, setOnMobileScreen] = useState(false)

  // عناصر القائمة
  const MenuItems: { title: string; href: string; description: string }[] = [
    {
      title: 'تحضير',
      href: '/preparation',
      description:
        'شمس هي منصة إستثمراية زراعية تهدف إلى زيادة المفهوم الزراعي لدى المستثمرين وذلك بعرض مشاريع متنوعة في مجال الزراعة...أقرأ المزيد.'
    },
    {
      title: 'زراعة',
      href: '/farming',
      description: 'مشاريعنا الحالية والمستقبلية...أستكشف'
    },
    {
      title: 'حصاد',
      href: '/harvest',
      description: 'موسم الحصاد...أقرأ المزيد'
    }
  ]

  const isSticky = () => {
    const scrollTop = window.scrollY
    scrollTop > 200 ? setSticky(true) : setSticky(false)
  }
  useEventListener('scroll', isSticky)

  const WINDOW_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 0
  const MOBILE_SCREEN = 768

  useEffect(() => {
    setOnMobileScreen(WINDOW_WIDTH < MOBILE_SCREEN)
  }, [WINDOW_WIDTH])

  return (
    <header
      className={`container py-2 rtl h-auto w-full top-0 left-0 bg-gray-100 dark:bg-gray-800 z-[100] ${
        sticky
          ? 'fixed w-screen min-w-full animate-slidedown border-b md:py-0 border-white border-opacity-20 dark:bg-opacity-30 bg-opacity-70 backdrop-blur backdrop-filter'
          : 'absolute min-w-full'
      }`}
    >
      <NavigationMenu className='md:flex max-w-full justify-end w-full'>
        <MenuToggler setIsOpen={setIsOpen} isOpen={isOpen} />
        {!onMobileScreen ? (
          <NavigationMenuList
            className={`fixed left-0 h-screen w-screen min-w-[100vw] items-end md:items-center justify-end flex-col-reverse flex-wrap gap-x-3 transition-all duration-200 pointer-events-none
           md:static md:h-fit md:w-fit md:translate-y-0 md:pointer-events-auto md:flex-row ${
             isOpen
               ? 'opacity-100 translate-y-0 pointer-events-auto bg-white dark:bg-black justify-start pt-14 md:pt-0'
               : '-translate-y-full opacity-0 md:opacity-100'
           }`}
          >
            {/* عن شمس */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>عن شمس</NavigationMenuTrigger>
              <NavigationMenuContent className='rtl'>
                <ul className='grid gap-3 p-4 min-w-screen w-dvw md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                  <NavigationListItem href='/about' title='عن شمس'></NavigationListItem>
                  <NavigationListItem
                    href='/contact'
                    title='تواصل معنا'
                  ></NavigationListItem>
                  <NavigationMenuLink asChild>
                    <div className={isAuth ? `flex items-center justify-between` : ``}>
                      <NavigationListItem
                        className={isAuth ? `w-1/2 text-center` : `w-full`}
                        href={isAuth ? `/profile` : `/auth/signin`}
                        title={isAuth ? session?.user?.name ?? 'حسابي' : `تسجيل الدخول`}
                      ></NavigationListItem>
                      {isAuth && (
                        <NavigationListItem className='cursor-pointer w-full'>
                          <button
                            className='flex gap-2 md:gap-1 items-center justify-center min-w-fit'
                            onClick={async () =>
                              await signOut({
                                redirect: true,
                                callbackUrl: APP_URL ?? '/'
                              })
                            }
                          >
                            <LogOut className='text-[#FDB813]' />
                            <span className='hidden md:inline-block min-w-fit'>
                              تسجيل الخروج
                            </span>
                          </button>
                        </NavigationListItem>
                      )}
                    </div>
                  </NavigationMenuLink>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* المشاريع الزراعية */}
            <NavigationMenuItem>
              <Link href='/projects' legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), `pr-6 md:pr-4`)}
                >
                  المشاريع الزراعية
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* الخدمات */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>الخدمات</NavigationMenuTrigger>
              <NavigationMenuContent className='rtl'>
                <ul className='grid min-w-screen w-dvw gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] right-0'>
                  {MenuItems.map(component => (
                    <NavigationListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </NavigationListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* الرئيسية */}
            <NavigationMenuItem>
              <Link href='/' legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), `pr-6 md:pr-4`)}
                >
                  الرئيسية
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* شعار الموقع */}
            <NavigationMenuItem className='hidden md:list-item'>
              <Link className='font-bold' href={'/'}>
                <Image
                  src='/logo-slogan.svg'
                  priority={true}
                  width={150}
                  height={50}
                  alt='شمس الزراعية'
                  className={`rounded-full ${sticky ? 'w-20 h-20' : 'w-24 h-24'}`}
                />
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        ) : (
          <MobileNavigation />
        )}
      </NavigationMenu>
    </header>
  )
}

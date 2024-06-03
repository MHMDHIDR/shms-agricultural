'use client'

import {
  NavigationListItem,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import useEventListener from '@/hooks/useEventListener'
import { getAuth } from '@/lib/actions/auth'
import { abstractWords, cn, getUser } from '@/lib/utils'
import type { MenuItemsProps, UserLoggedInProps, UserProps, getAuthType } from '@/types'
import { LogIn, LogOut } from 'lucide-react'
import { signOut, useSession, type SessionContextValue } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShmsIcon } from '@/components/icons/Socials'
import { Button } from '@/components/ui/button'
import { MenuToggler } from './MenuToggler'
import MobileNavigation from './MobileNavigation'
import { Skeleton } from '@/components/ui/skeleton'
import { APP_URL } from '@/data/constants'

export default function Nav() {
  const {
    status,
    data: session
  }: { status: SessionContextValue['status']; data: UserLoggedInProps } = useSession()

  const isAuth = status === 'authenticated' ? true : false

  const [isOpen, setIsOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [onMobileScreen, setOnMobileScreen] = useState(false)

  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const [userName, setUserName] = useState('')

  // عناصر القائمة
  const MenuItems: MenuItemsProps = [
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
    const getUserData = async () => {
      const { userType, loading } = (await getAuth()) as getAuthType
      if (loading) return
      setIsUserAdmin(userType === 'admin')
    }
    getUserData()
  }, [])

  useEffect(() => {
    if (session) {
      const refetchSession = async () => {
        const { userId, userStockLimit, userName, userEmail, userPhone, userType } =
          (await getAuth()) as getAuthType

        const { shms_user_total_balance, shms_user_withdrawable_balance } =
          (await getUser(userId)) as UserProps

        localStorage.setItem(
          'shms_user_data',
          JSON.stringify({
            userId,
            userStockLimit,
            userName,
            userEmail,
            userPhone,
            userType,
            totalAmount: shms_user_total_balance,
            withdrawableAmount: shms_user_withdrawable_balance
          })
        )
      }
      refetchSession()
    }
  }, [session])

  useEffect(() => {
    setUserName(
      abstractWords({
        words: session?.token?.user.fullname ?? 'حسابي',
        wordsLength: 2,
        ellipsis: false
      })
    )
  }, [session?.token?.user.fullname])

  useEffect(() => {
    setOnMobileScreen(WINDOW_WIDTH < MOBILE_SCREEN)
  }, [WINDOW_WIDTH])

  const handleSignOut = async () => {
    localStorage.removeItem('shms_user_data')
    try {
      await signOut({ redirect: true, callbackUrl: APP_URL ?? '/' })
    } catch (error) {
      console.error('Sign-out error:', error)
    }
  }

  return (
    <header
      className={`container relative rtl bg-gray-100 dark:bg-gray-900 z-[999] w-screen min-w-full animate-slidedown border-b py-0 border-white border-opacity-20 dark:bg-opacity-30 bg-opacity-70 backdrop-blur backdrop-filter`}
    >
      <NavigationMenu className='items-center justify-start w-full max-w-full md:flex rtl'>
        <MenuToggler setIsOpen={setIsOpen} isOpen={isOpen} />
        {/* شعار الموقع */}
        <Link href={'/'} onClick={() => setIsOpen(false)}>
          <ShmsIcon
            className={`ml-10 transition duration-500 w-16 h-16 ${
              sticky ? 'scale-150' : 'scale-100'
            }`}
          />
        </Link>
        {onMobileScreen ? (
          <MobileNavigation
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            MenuItems={MenuItems}
            isUserAdmin={isUserAdmin}
          />
        ) : (
          <NavigationMenuList
            className={`fixed left-0 h-screen w-screen min-w-[100vw] items-end md:items-center justify-end flex-col-reverse flex-wrap gap-x-3 transition-all duration-200 pointer-events-none
           md:static md:h-fit md:w-fit md:translate-y-0 md:pointer-events-auto md:flex-row ${
             isOpen
               ? 'opacity-100 translate-y-0 pointer-events-auto bg-white dark:bg-black justify-end pt-14 md:pt-0'
               : '-translate-y-full opacity-0 md:opacity-100'
           }`}
          >
            {/* تسجيل الدخول */}
            <div className='flex items-center gap-x-4'>
              {!isAuth ? (
                <Link className={`w-full`} href={`/auth/signin`}>
                  <Button className='flex w-full cursor-pointer gap-x-2'>
                    تسجيل الدخول
                    <LogIn className='text-[#FDB813] dark:text-[#ffd87e]' />
                  </Button>
                </Link>
              ) : (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    {!userName ? <Skeleton className='w-20 h-3' /> : userName}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='rtl'>
                    <ul className='grid gap-3 p-4 min-w-screen w-dvw md:w-[400px] grid-rows-3 grid-cols-1 lg:w-[500px]'>
                      <NavigationListItem
                        href='/profile/investments'
                        title='لوحة التحكم'
                      ></NavigationListItem>
                      {isUserAdmin ? (
                        <NavigationListItem
                          className={`w-full`}
                          href='/dashboard'
                          title='الإدارة'
                        ></NavigationListItem>
                      ) : null}
                      <NavigationListItem
                        href='/contact'
                        title='تواصل معنا'
                      ></NavigationListItem>

                      <Button
                        className='flex w-full cursor-pointer gap-x-2'
                        onClick={handleSignOut}
                      >
                        <LogOut className='text-[#FDB813] dark:text-[#ffd87e]' />
                        <span className='hidden text-white md:inline-block min-w-fit dark:text-black'>
                          تسجيل الخروج
                        </span>
                      </Button>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}
            </div>

            {/* عن شمس */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>عن شمس</NavigationMenuTrigger>
              <NavigationMenuContent className='rtl'>
                <ul className='grid gap-3 p-4 min-w-screen w-dvw md:w-[400px] lg:w-[500px] grid-rows-2 grid-cols-1'>
                  <NavigationListItem href='/about'>من نحن</NavigationListItem>
                  <NavigationListItem href='/contact'>تواصل معنا</NavigationListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* المشاريع الاستثمارية */}
            <NavigationMenuItem>
              <Link href='/projects' legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), `pr-6 md:pr-4`)}
                >
                  المشاريع الاستثمارية
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {/* الخدمات */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>الخــدمات</NavigationMenuTrigger>
              <NavigationMenuContent className='rtl'>
                <ul className='grid gap-3 p-4 min-w-screen w-dvw md:w-[400px] lg:w-[500px] grid-rows-2 grid-cols-1'>
                  {MenuItems.map(component => (
                    <NavigationListItem key={component.title} href={component.href}>
                      {component.title}
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
          </NavigationMenuList>
        )}
      </NavigationMenu>
    </header>
  )
}

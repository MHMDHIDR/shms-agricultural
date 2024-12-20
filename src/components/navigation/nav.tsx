'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
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
import { getAuth } from '@/libs/actions/auth'
import { abstractWords, cn, getUser, handleSignOut } from '@/libs/utils'
import { LogIn, LogOut } from 'lucide-react'
import { MenuToggler } from './menu-toggler'
import MobileNavigation from './mobile-navigation'
import { ShmsIcon } from '@/components/icons/socials'
import { Button } from '@/components/ui/button'
import Feedback from '@/components/custom/feedback'
import { Skeleton } from '@/components/ui/skeleton'
import type { Users } from '@prisma/client'
import type { MenuItemsProps, UserLoggedInProps, getAuthType } from '@/types'
import type { SessionContextValue } from 'next-auth/react'
import { MOBILE_SCREEN, WINDOW_WIDTH } from '@/data/constants'

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

  let currentUser: getAuthType =
    typeof window !== 'undefined' &&
    JSON.parse(String(localStorage.getItem('shms_user_data')))

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

        const { shms_user_credits } = ((await getUser(userId)) as Users) ?? {
          shms_user_credits: 0
        }

        localStorage.setItem(
          'shms_user_data',
          JSON.stringify({
            userId,
            userStockLimit,
            userName,
            userEmail,
            userPhone,
            userType,
            totalCredits: shms_user_credits
          })
        )
      }
      refetchSession()
    }
  }, [session])

  useEffect(() => {
    setUserName(
      abstractWords({
        words: currentUser?.userName ?? session?.token?.user.shms_fullname ?? 'حسابي',
        wordsLength: 2,
        ellipsis: false
      })
    )
  }, [session?.token?.user.shms_fullname, currentUser])

  useEffect(() => {
    setOnMobileScreen(WINDOW_WIDTH < MOBILE_SCREEN)
  }, [])

  return (
    <header
      className={`container relative rtl bg-gray-100 dark:bg-gray-900 z-50 w-screen min-w-full animate-slidedown border-b py-0 border-white border-opacity-20 dark:bg-opacity-30 bg-opacity-70 backdrop-blur backdrop-filter`}
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
            {isAuth ? (
              <Feedback
                name={currentUser?.userName ?? session?.token?.user.shms_fullname ?? ''}
                email={currentUser?.userEmail ?? session?.token?.user.shms_email ?? ''}
              />
            ) : null}

            {/* تسجيل الدخول */}
            <NavigationMenuItem>
              {!session || !isAuth ? (
                <Link className={`w-full`} href={`/auth/signin`}>
                  <Button className='flex w-full cursor-pointer gap-x-2'>
                    تسجيل الدخول
                    <LogIn className='text-[#FDB813] dark:text-[#ffd87e]' />
                  </Button>
                </Link>
              ) : (
                <div>
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
                </div>
              )}
            </NavigationMenuItem>

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

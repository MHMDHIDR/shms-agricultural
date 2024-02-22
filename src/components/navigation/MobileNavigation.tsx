import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { abstractWords, cn } from '@/lib/utils'
import type { MenuItemsProps, UserLoggedInProps } from '@/types'
import { LogOut } from 'lucide-react'
import { signOut, useSession, type SessionContextValue } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NavigationListItem } from '../ui/navigation-menu'

export default function MobileNavigation({
  isOpen,
  setIsOpen,
  MenuItems,
  isUserAdmin,
  className
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  MenuItems: MenuItemsProps
  isUserAdmin?: boolean
  className?: string
}) {
  const {
    status,
    data: session
  }: { status: SessionContextValue['status']; data: UserLoggedInProps } = useSession()
  const isAuth = status === 'authenticated' ? true : false

  const [userName, setUserName] = useState('')
  const { replace } = useRouter()

  useEffect(() => {
    setUserName(
      abstractWords({
        words: session?.token?.user.fullname ?? 'حسابي',
        wordsLength: 2,
        ellipsis: false
      })
    )
  }, [session?.token?.user.fullname])

  return (
    <Accordion
      type='single'
      className={cn(`w-full transition rtl ${isOpen ? 'block' : 'hidden'}`, className)}
      collapsible
    >
      {/* الخدمات */}
      <AccordionItem value='item-4'>
        <AccordionTrigger>الخدمات</AccordionTrigger>
        <AccordionContent>
          <ul className='grid min-w-screen w-dvw gap-1 md:w-[500px] md:grid-cols-2 lg:w-[600px] right-0'>
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
        </AccordionContent>
      </AccordionItem>
      {/* المشاريع الاستثمارية */}
      <AccordionItem value='item-3'>
        <AccordionTrigger isDropDown={false}>
          <Link href='/projects' onClick={() => setIsOpen(open => !open)} passHref>
            المشاريع الاستثمارية
          </Link>
        </AccordionTrigger>
      </AccordionItem>
      {/* عن شمس */}
      <AccordionItem value='item-2'>
        <AccordionTrigger>عن شمس</AccordionTrigger>
        <AccordionContent>
          <ul className='grid gap-1 min-w-screen w-dvw md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
            <NavigationListItem href='/about' onClick={() => setIsOpen(open => !open)}>
              من نحن
            </NavigationListItem>
            <NavigationListItem href='/contact' onClick={() => setIsOpen(open => !open)}>
              تواصل معنا
            </NavigationListItem>
          </ul>
        </AccordionContent>
      </AccordionItem>
      {/* تسجيل الدخول */}
      <AccordionItem value='item-1'>
        <AccordionTrigger>{userName}</AccordionTrigger>
        <AccordionContent>
          <ul className='grid min-w-screen w-dvw md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
            <NavigationListItem href={isAuth ? `/profile/investments` : `/auth/signin`}>
              {isAuth ? 'لوحة التحكم' : `تسجيل الدخول`}
            </NavigationListItem>
            {isUserAdmin ? (
              <NavigationListItem href='/dashboard'>الإدارة</NavigationListItem>
            ) : null}
            {isAuth && (
              <>
                <NavigationListItem
                  className='flex items-center justify-start md:gap-1'
                  onClick={async () => {
                    localStorage.removeItem('shms_user_data')
                    await signOut({ redirect: false })
                    replace('/auth/signin')
                  }}
                >
                  <span className='inline md:hidden dark:text-white'>تسجيل الخروج</span>
                  <LogOut className='text-[#FDB813] inline-block dark:text-[#ffd87e] mr-2' />
                </NavigationListItem>
              </>
            )}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

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
      collapsible
      className={cn(`w-full transition rtl ${isOpen ? 'block' : 'hidden'}`, className)}
    >
      {/* الخدمات */}
      <AccordionItem value='item-4'>
        <AccordionTrigger>الخدمات</AccordionTrigger>
        <AccordionContent>
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
          <ul className='grid gap-3 p-4 min-w-screen w-dvw md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
            <NavigationListItem
              href='/contact'
              title='تواصل معنا'
              onClick={() => setIsOpen(open => !open)}
            ></NavigationListItem>
            <NavigationListItem
              href='/about'
              title='من نحن'
              onClick={() => setIsOpen(open => !open)}
            ></NavigationListItem>
          </ul>
        </AccordionContent>
      </AccordionItem>
      {/* تسجيل الدخول */}
      <AccordionItem value='item-2'>
        <AccordionTrigger>{userName}</AccordionTrigger>
        <AccordionContent>
          <ul className='grid gap-3 p-4 min-w-screen w-dvw md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
            <NavigationListItem
              className={`py-2 ${isAuth ? `w-1/2 text-center` : `w-full`}`}
              href={isAuth ? `/profile` : `/auth/signin`}
            >
              {isAuth ? 'الملف الشخصي' : `تسجيل الدخول`}
            </NavigationListItem>
            {isUserAdmin ? (
              <NavigationListItem className={`w-full text-center`} href='/dashboard'>
                لوحة التحكم
              </NavigationListItem>
            ) : null}
            {isAuth && (
              <NavigationListItem
                className='flex items-center justify-center gap-2 md:gap-1'
                onClick={async () => {
                  await signOut({ redirect: false })
                  replace('/auth/signin')
                }}
              >
                <LogOut className='text-[#FDB813] dark:text-[#ffd87e]' />
                <span className='inline-block text-white md:hidden dark:text-black'>
                  تسجيل الخروج
                </span>
              </NavigationListItem>
            )}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

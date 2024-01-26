import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { NavigationListItem } from '../ui/navigation-menu'
import { signOut, useSession } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { MenuItemsProps } from '@/types'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

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
  const { status } = useSession()
  const isAuth = status === 'authenticated' ? true : false

  return (
    <Accordion
      type='single'
      collapsible
      className={cn(`w-full transition rtl ${isOpen ? 'block' : 'hidden'}`, className)}
    >
      {/* الخدمات */}
      <AccordionItem value='item-3'>
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
      <AccordionItem value='item-2'>
        <AccordionTrigger isDropDown={false}>
          <Link href='/projects' onClick={() => setIsOpen(open => !open)} passHref>
            المشاريع الاستثمارية
          </Link>
        </AccordionTrigger>
      </AccordionItem>
      {/* عن شمس */}
      <AccordionItem value='item-1'>
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
      <div className='flex items-center gap-x-4 pt-2'>
        {isUserAdmin ? (
          <Link className={`w-full text-center`} href={`/dashboard`}>
            لوحة التحكم
          </Link>
        ) : null}
        <Link
          className={`py-2 ${isAuth ? `w-1/2 text-center` : `w-full`}`}
          href={isAuth ? `/profile` : `/auth/signin`}
        >
          {isAuth ? 'حسابي' : `تسجيل الدخول`}
        </Link>
        {isAuth && (
          <Button
            className='flex gap-2 md:gap-1 items-center justify-center'
            onClick={async () => {
              await signOut()
              useRouter().push('/auth/signin')
            }}
          >
            <LogOut className='text-[#FDB813]' />
            <span className='inline-block md:hidden'>تسجيل الخروج</span>
          </Button>
        )}
      </div>
    </Accordion>
  )
}

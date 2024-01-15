'use client'

import { useState } from 'react'
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
import { Sun, LogOut } from 'lucide-react'
import { ModeToggle } from './ModeToggle'
import { MenuToggler } from './MenuToggler'
import useAuth from '@/hooks/useAuth'
import useEventListener from '@/hooks/useEventListener'

export default function Nav() {
  const { userId } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [sticky, setSticky] = useState(false)

  // عناصر القائمة
  const MenuItems: { title: string; href: string; description: string }[] = [
    {
      title: 'البداية',
      href: '/about/our-story',
      description:
        'شمس هي منصة إستثمراية زراعية تهدف إلى زيادة المفهوم الزراعي لدى المستثمرين وذلك بعرض مشاريع متنوعة في مجال الزراعة...أقرأ المزيد.'
    },
    {
      title: 'المشاريع',
      href: '/about/projects',
      description: 'مشاريعنا الحالية والمستقبلية...أستكشف'
    },
    {
      title: 'المزايا',
      href: '/about/features',
      description:
        'مزايا شمس الحصرية التي تميزها عن غيرها من المنصات الزراعية...أقرأ المزيد'
    },
    {
      title: 'الأسئلة الشائعة',
      href: '/about/faq',
      description: 'الأسئلة الشائعة حول شمس...أقرأ المزيد'
    },
    {
      title: 'نماذج الإستثمار',
      href: '/about/investment-models',
      description: 'نماذج الإستثمار المتاحة في شمس...أقرأ المزيد'
    },
    {
      title: 'المدونة',
      href: '/blog',
      description:
        'مدونة شمس الزراعية تحتوي على مقالات ونصائح مهمة في مشارعنا زراعية...أقرأ المزيد'
    }
  ]

  const isSticky = () => {
    const scrollTop = window.scrollY
    scrollTop > 200 ? setSticky(true) : setSticky(false)
  }
  useEventListener('scroll', isSticky)

  return (
    <header
      className={`container text-foreground py-0 md:py-6 rtl top-0 left-0 z-50 h-auto w-full ${
        sticky
          ? 'fixed animate-slidedown border-b md:py-2 border-white border-opacity-20 bg-grey bg-opacity-80 backdrop-blur backdrop-filter'
          : 'absolute'
      }`}
    >
      <NavigationMenu className='md:flex max-w-full justify-end w-full'>
        <MenuToggler setIsOpen={setIsOpen} isOpen={isOpen} />

        <NavigationMenuList
          className={`fixed left-0 h-screen w-screen min-w-[100vw] items-end md:items-center justify-end flex-col flex-wrap gap-x-3 transition-all duration-200 pointer-events-none
          md:static md:h-fit md:w-fit md:translate-y-0 md:pointer-events-auto md:flex-row ${
            isOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto bg-white dark:bg-black justify-start pt-14'
              : '-translate-y-full opacity-0 md:opacity-100'
          }`}
        >
          {/* تحويل الثيم الحالي */}
          <NavigationMenuItem className='md:mr-auto'>
            <ModeToggle />
          </NavigationMenuItem>

          {/* جدول الموسم الزراعي */}
          <NavigationMenuItem>
            <Link href='/season' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                جدول الموسم الزراعي
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {/* عن شمس */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>عن شمــس</NavigationMenuTrigger>
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
          {/* البداية هنا */}
          <NavigationMenuItem>
            <NavigationMenuTrigger>البداية هنا</NavigationMenuTrigger>
            <NavigationMenuContent className='rtl'>
              <ul className='grid gap-3 p-4 min-w-screen w-dvw md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                <li className='row-span-3'>
                  <NavigationMenuLink asChild>
                    <a
                      className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-2 no-underline outline-none focus:shadow-md'
                      href='/'
                    >
                      <h1 className='my-auto text-lg font-medium'>
                        <Sun className='text-[#FDB813] inline-block ml-2' />
                        شمس الزراعية
                      </h1>
                      <p className='my-auto text-sm leading-tight text-muted-foreground'>
                        للخدمات الزراعية والإستثمارية
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <NavigationListItem
                  href='/introduction'
                  title='المقدمة'
                ></NavigationListItem>
                <NavigationMenuLink asChild>
                  <div className={userId ? `flex items-center justify-between` : ``}>
                    <NavigationListItem
                      className={userId ? `w-1/2 text-center` : `w-full`}
                      href={userId ? `/profile` : `/signin`}
                      title={userId ? `حسابي` : `تسجيل الدخول`}
                    ></NavigationListItem>
                    {userId && (
                      <NavigationListItem className='cursor-pointer w-1/2'>
                        <button
                          className='flex gap-2 md:gap-1 items-center justify-center min-w-max'
                          // onClick={signOut()}
                        >
                          <LogOut className='text-[#FDB813]' />
                          <span className='hidden md:inline-block'>تسجيل الخروج</span>
                        </button>
                      </NavigationListItem>
                    )}
                  </div>
                </NavigationMenuLink>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* شعار الموقع */}
          <NavigationMenuItem className='hidden md:list-item'>
            <Link className='font-bold' href={'/'}>
              <Sun className='text-[#FDB813] md:ml-10' />
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}

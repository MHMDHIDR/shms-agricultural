'use client'

import { useAuth } from '@clerk/nextjs'
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
import { Sun } from 'lucide-react'
import { ModeToggle } from './ModeToggle'

export default function Nav() {
  const { userId } = useAuth()

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
      href: '/about/blog',
      description:
        'مدونة شمس الزراعية تحتوي على مقالات ونصائح مهمة في مشارعنا زراعية...أقرأ المزيد'
    }
  ]

  return (
    <header className='bg-background text-foreground py-6 rtl container'>
      <NavigationMenu className='md:flex max-w-full justify-end w-full'>
        <NavigationMenuList className='min-w-[100vw] justify-end'>
          {/* تحويل الثيم الحالي */}
          <NavigationMenuItem className='mr-auto'>
            <ModeToggle className='mr-auto' />
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
              <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] right-0'>
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
              <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                <li className='row-span-3'>
                  <NavigationMenuLink asChild>
                    <a
                      className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-2 no-underline outline-none focus:shadow-md'
                      href='/'
                    >
                      <h1 className='mb-2 text-lg font-medium'>
                        <Sun className='text-[#FDB813] inline-block ml-2' />
                        شمس الزراعية
                      </h1>
                      <p className='text-sm leading-tight text-muted-foreground'>
                        للخدمات الزراعية والإستثمارية
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <NavigationListItem
                  href='/introduction'
                  title='المقدمة'
                ></NavigationListItem>
                <NavigationListItem href={userId ? `/profile` : `/signin`} title='حسابي'>
                  {userId ? `حسابي` : `تسجيل الدخول`}
                </NavigationListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {/* شعار الموقع */}
          <NavigationMenuItem>
            <Link className='font-bold' href={'/'}>
              <Sun className='text-[#FDB813] ml-10' />
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}

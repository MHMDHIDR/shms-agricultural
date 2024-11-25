'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AlignRight,
  DollarSignIcon,
  HomeIcon,
  Link2Icon,
  PercentIcon,
  Tractor,
  Users2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { DashboardIcon } from '@radix-ui/react-icons'

export default function Dashboard() {
  const currentPath = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' variant='outline' className='absolute right-20 top-36'>
          <AlignRight className='w-6 h-6 stroke-1' />
          <span className='sr-only'>تصفح لوحة التحكم</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='sm:max-w-xs'>
        <nav className='grid gap-6 text-lg font-medium pt-14 rtl'>
          <SheetHeader>
            <SheetTitle>
              <Link
                href='/'
                className='flex items-center justify-center w-10 h-10 gap-2 text-lg font-semibold rounded-full group shrink-0 bg-primary text-primary-foreground md:text-base'
              >
                <HomeIcon className='w-5 h-5 transition-all group-hover:scale-110' />
                <span className='sr-only'>زيارة الصفحة الرئيسية</span>
              </Link>
            </SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <Link
            href='/dashboard'
            className={`flex items-center gap-4 px-2.5 ${
              currentPath === '/dashboard'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <DashboardIcon className='w-5 h-5' />
            لوحة التحكم
          </Link>
          <Link
            href='/dashboard/projects'
            className={`flex items-center gap-4 px-2.5 ${
              currentPath === '/dashboard/projects'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Tractor className='w-5 h-5' />
            المشاريع
          </Link>
          <Link
            href='/dashboard/money-operations'
            className={`flex items-center gap-4 px-2.5 ${
              currentPath === '/dashboard/money-operations'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <DollarSignIcon className='w-5 h-5' />
            العمليات المالية
          </Link>
          <Link
            href='/dashboard/users'
            className={`flex items-center gap-4 px-2.5 ${
              currentPath === '/dashboard/users'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users2 className='w-5 h-5' />
            العملاء
          </Link>
          <Link
            href='/dashboard/profits-percentage'
            className={`flex items-center gap-4 px-2.5 ${
              currentPath === '/dashboard/profits-percentage'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <PercentIcon className='w-5 h-5' />
            نسب الأرباح
          </Link>
          <Link
            href='/dashboard/social-links'
            className={`flex items-center gap-4 px-2.5 ${
              currentPath === '/dashboard/social-links'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Link2Icon className='w-5 h-5' />
            صفحات التواصل الاجتماعي
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

import Drawer from '@/components/custom/Drawer'
import {
  AlignRight,
  AreaChartIcon,
  BadgeDollarSign,
  ProjectorIcon,
  UsersIcon
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardNav() {
  return (
    <Drawer
      className='max-h-[calc(100vh-5rem)]'
      content={
        <div className='h-full px-3 py-4 overflow-y-auto'>
          <ul className='space-y-2 font-medium'>
            <li>
              <Link
                href='/dashboard/add-project'
                className='flex items-center p-4 pr-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <ProjectorIcon className='w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className='inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300'>
                  المشاريع
                </span>
              </Link>
            </li>
            <li>
              <Link
                href='/dashboard/money-operations'
                className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <BadgeDollarSign className='w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className='flex-1 ms-3 whitespace-nowrap'>العمليات المالية</span>
              </Link>
            </li>
            <li>
              <Link
                href='/dashboard/users'
                className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <UsersIcon className='w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className='ms-3'>العملاء</span>
              </Link>
            </li>
            <li>
              <Link
                href='/dashboard/profits-percentage'
                className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'
              >
                <AreaChartIcon className='w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' />
                <span className='flex-1 ms-3 whitespace-nowrap'>نسب الأرباح</span>
              </Link>
            </li>
          </ul>
        </div>
      }
      asSpan
    >
      <span
        data-drawer-target='default-sidebar'
        data-drawer-toggle='default-sidebar'
        aria-controls='default-sidebar'
        className='absolute right-5 z-50 top-20 items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
      >
        <span className='sr-only'>تصفح لوحة التحكم</span>
        <AlignRight className='w-6 h-6 stroke-1' />
      </span>
    </Drawer>
  )
}

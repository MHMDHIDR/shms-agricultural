import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DashboardView from './view/page'
import DashboardActions from './actions/page'

import Users from './users/page'

export default function DashboardPage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-16 lg:p-24'>
      <Tabs style={{ width: '100%' }} defaultValue='view' className='w-[400px] mt-10'>
        <TabsList className='grid w-full grid-cols-3 space-x-4'>
          <TabsTrigger style={{ borderWidth: 1, borderColor: 'gray' }} value='view'>
            المشاريع
          </TabsTrigger>
          <TabsTrigger style={{ borderWidth: 1, borderColor: 'gray' }} value='view'>
            الاحصائيات
          </TabsTrigger>
          <TabsTrigger style={{ borderWidth: 1, borderColor: 'gray' }} value='actions'>
            العمليات
          </TabsTrigger>
          <TabsTrigger style={{ borderWidth: 1, borderColor: 'gray' }} value='users'>
            المستخدمين
          </TabsTrigger>
        </TabsList>

        <DashboardView />

        <DashboardActions />

        <Users />
      </Tabs>
    </main>
  )
}

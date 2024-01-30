import Layout from '@/components/custom/Layout'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AddProjects from './projects/page'
import Users from './users/page'
import DashboardView from './view/page'

export default function DashboardPage() {
  return (
    <Layout>
      <main className='flex flex-col items-center justify-between min-h-screen p-4 sm:p-8 md:p-16 lg:p-24'>
        <Tabs defaultValue='view' className='w-full mt-16'>
          <TabsList className='w-full mb-10 grid grid-cols-2 gap-2 space-x-4 sm:grid-cols-3 md:mb-0'>
            <TabsTrigger className='border border-gray-300' value='view'>
              احصائيات
            </TabsTrigger>
            <TabsTrigger className='border border-gray-300' value='users'>
              جدول المستخدمين
            </TabsTrigger>
            <TabsTrigger className='border border-gray-300' value='add_project'>
              المشاريع
            </TabsTrigger>
          </TabsList>

          {/*  إحصائيات المستثمرين و المساهمين */}
          <DashboardView />
          {/* تاب المستخدمين */}
          <Users />
          {/* تاب إدارة المشاريع */}
          <AddProjects />
        </Tabs>
      </main>
    </Layout>
  )
}

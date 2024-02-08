import Layout from '@/components/custom/Layout'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DashboardInvestors from './Investors/page'
import AddProjects from './projects/page'
import Users from './users/page'
import CountPercentagePage from './countPercentage/page'

export default function DashboardPage() {
  return (
    <Layout>
      <main className='flex flex-col items-center justify-between min-h-screen p-4 sm:p-8 md:p-16 lg:p-24'>
        <Tabs defaultValue='investors' className='w-full mt-16'>
          <TabsList className='grid items-center w-full grid-cols-2 gap-2 mb-20 space-x-4 sm:grid-cols-4 md:mb-0'>
            <TabsTrigger className='border border-gray-300' value='investors'>
              احصائيات
            </TabsTrigger>
            <TabsTrigger className='border border-gray-300' value='users'>
              المستخدمين
            </TabsTrigger>
            <TabsTrigger className='border border-gray-300' value='add_project'>
              المشاريع
            </TabsTrigger>
            <TabsTrigger className='border border-gray-300' value='profits_percentage'>
              نسب الأرباح
            </TabsTrigger>
          </TabsList>

          {/*  إحصائيات المستثمرين و المساهمين */}
          <DashboardInvestors />
          {/* تاب المستخدمين */}
          <Users />
          {/* تاب إدارة المشاريع */}
          <AddProjects />
          {/* تاب نسب الأرباح */}
          <CountPercentagePage />
        </Tabs>
      </main>
    </Layout>
  )
}

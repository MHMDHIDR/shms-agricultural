import NotFound from '@/app/not-found'
import { getAuth } from '@/libs/actions/auth'
import Layout from '@/components/custom/layout'
import { LoadingPage } from '@/components/custom/loading'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NewWithdraw from './new-withdraw'
import WithdrawOperations from './withdraw-operations'

export default async function WithDrawPage() {
  const { userType, loading } = await getAuth()

  return !userType ? (
    <NotFound />
  ) : loading ? (
    <LoadingPage />
  ) : (
    <Layout>
      <section className='container flex flex-col items-center justify-between min-h-svh'>
        <Tabs defaultValue='withdraw_operations' className='w-full mx-auto mt-16'>
          <TabsList className='items-center w-full mb-6 grid grid-cols-2 gap-2'>
            <TabsTrigger className='border border-gray-300' value='withdraw_operations'>
              عمليات السحب
            </TabsTrigger>
            <TabsTrigger className='border border-gray-300' value='new_withdraw'>
              سحب جديد
            </TabsTrigger>
          </TabsList>

          {/* عمليات السحب جميعا */}
          <WithdrawOperations />
          {/* عملية سحب جديدة */}
          <NewWithdraw />
        </Tabs>
      </section>
    </Layout>
  )
}

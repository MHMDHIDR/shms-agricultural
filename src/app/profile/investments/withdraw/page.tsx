import Layout from '@/components/custom/Layout'
import { LoadingPage } from '@/components/custom/Loading'
import NotFound from '@/app/not-found'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NewWithdraw from './_NewWithdraw'
import WithdrawOperations from './_WithdrawOperations'
import { getAuth } from '@/lib/actions/auth'

export default async function WithDrawPage() {
  const { userType, loading } = await getAuth()

  return !userType ? (
    <NotFound />
  ) : loading ? (
    <LoadingPage />
  ) : (
    <Layout>
      <section className='container flex flex-col items-center justify-between'>
        <Tabs defaultValue='new_withdraw' className='w-full mx-auto mt-16'>
          <TabsList className='grid items-center w-full grid-cols-2 gap-2 mb-6'>
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

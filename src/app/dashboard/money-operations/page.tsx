import { getUserMoneyOperations } from '@/libs/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import DataTable from '@/components/custom/data-table'
import Layout from '@/components/custom/layout'
import DashboardNav from '../dashboard-nav'
import NotFound from '@/app/not-found'
import { getAuth } from '@/libs/actions/auth'
import { LoadingPage } from '@/components/custom/loading'

export default async function MoneyOperations() {
  const { userType, loading } = await getAuth()
  const withdrawActions = await getUserMoneyOperations()

  return loading ? (
    <LoadingPage />
  ) : userType !== 'admin' ? (
    <NotFound />
  ) : (
    <Layout>
      <h1 className='mt-20 mb-10 text-2xl font-bold text-center'>العمليات المالية</h1>
      <DashboardNav />

      <section className='container mx-auto'>
        <Card className='min-w-full'>
          <CardHeader dir='rtl' className='select-none'>
            <CardTitle className='text-center'>
              عمليات السحب والإيداع
              <strong className='px-2 mr-4 border rounded-sm'>
                {withdrawActions.length ?? 0}
              </strong>
            </CardTitle>
            <CardDescription>
              هنا يمكنك مشاهدة جميع عمليات السحب والإيداع التي تمت في الموقع
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={withdrawActions} />
          </CardContent>
        </Card>
      </section>
    </Layout>
  )
}

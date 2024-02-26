import { getUserMoneyOperations } from '@/lib/utils'
import { accountingOperationsProps } from '@/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import DataTable from '@/components/custom/DataTable'
import Layout from '@/components/custom/Layout'
import DashboardNav from '../DashboardNav'

export default async function MoneyOperations() {
  const withdrawActions = (await getUserMoneyOperations()) as accountingOperationsProps[]

  return (
    <Layout>
      <h1 className='text-2xl mt-20 mb-10 font-bold text-center'>لوحة التحكم</h1>
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

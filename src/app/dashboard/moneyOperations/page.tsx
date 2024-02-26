import { TabsContent } from '@/components/ui/tabs'
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

export default async function MoneyOperations() {
  const withdrawActions = (await getUserMoneyOperations()) as accountingOperationsProps[]

  return (
    <TabsContent value='money_operations'>
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
    </TabsContent>
  )
}

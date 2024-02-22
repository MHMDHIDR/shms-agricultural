import { TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { getProjectDate, getProjectStatus, getUserMoneyOperations } from '@/lib/utils'
import { withdrawActionsProps } from '@/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Copy from '@/components/custom/Copy'

export default async function MoneyOperations() {
  const withdrawActions = (await getUserMoneyOperations()) as withdrawActionsProps[]

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
          <Table className='min-w-full text-center divide-y divide-gray-200 rtl'>
            <TableHeader>
              <TableRow>
                <TableHead className='font-bold text-center select-none'>
                  الرقم المرجعي
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  نوع العملية
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  تاريخ العملية
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  المبلـــــــــــــغ
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  حالة الطلب
                </TableHead>
                <TableHead className='font-bold text-center select-none'>
                  الإجراء
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!withdrawActions || withdrawActions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15} className='space-y-6'>
                    <Skeleton className='w-full h-12' />
                    <Skeleton className='w-full h-12' />
                    <Skeleton className='w-full h-12' />
                    <Skeleton className='w-full h-12' />
                  </TableCell>
                </TableRow>
              ) : (
                withdrawActions.map(withdrawAction => {
                  return (
                    <TableRow key={withdrawAction.shms_withdraw_id}>
                      <TableCell className='min-w-40'>
                        <Copy
                          text={withdrawAction.shms_withdraw_id}
                          className='inline ml-2'
                        />
                        <span>{withdrawAction.shms_withdraw_id}</span>
                      </TableCell>
                      <TableCell className='min-w-40'>سحب رصيد</TableCell>
                      <TableCell className='min-w-40'>
                        {getProjectDate(new Date(withdrawAction.shms_created_at))}
                      </TableCell>
                      <TableCell className='min-w-40'>
                        {withdrawAction.shms_withdraw_amount}
                      </TableCell>
                      <TableCell
                        className={
                          withdrawAction.withdraw_withdraw_status === 'pending'
                            ? 'text-yellow-500'
                            : withdrawAction.withdraw_withdraw_status === 'completed'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {getProjectStatus(withdrawAction.withdraw_withdraw_status)}
                      </TableCell>
                      <TableCell className='min-w-40'>
                        {/* withdrawAction.withdraw_withdraw_status */}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

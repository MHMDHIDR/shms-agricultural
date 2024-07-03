import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { getProjectDate, getProjectStatus, getUserMoneyOperations } from '@/libs/utils'
import { getAuth } from '@/libs/actions/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Copy from '@/components/custom/Copy'
import NoRecords from '@/components/custom/NoRecords'
import type { withdraw_actions } from '@prisma/client'

export const revalidate = 10
export default async function WithdrawOperations() {
  const { userId } = await getAuth()
  const withdrawActions = (await getUserMoneyOperations(userId)) as withdraw_actions[]

  return (
    <TabsContent value='withdraw_operations'>
      <Card className='min-w-full'>
        <CardHeader dir='rtl' className='select-none'>
          <CardTitle className='text-center'>
            عمليات السحب والإيداع
            <strong className='px-2 mr-4 border rounded-sm'>
              {withdrawActions.length ?? 0}
            </strong>
          </CardTitle>
          <CardDescription>
            هنا يمكنك مشاهدة جميع عمليات السحب والإيداع التي تمت على حسابك
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {!withdrawActions ? (
                <TableRow>
                  <TableCell colSpan={15} className='space-y-6'>
                    <Skeleton className='w-full h-12' />
                    <Skeleton className='w-full h-12' />
                    <Skeleton className='w-full h-12' />
                    <Skeleton className='w-full h-12' />
                  </TableCell>
                </TableRow>
              ) : withdrawActions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15} className='space-y-6'>
                    <NoRecords
                      className='max-w-44 max-h-44'
                      msg='لم يتم العثور على عمليات ســحب سابقة!'
                      button={
                        <TabsList>
                          <TabsTrigger className='pressable' value='new_withdraw'>
                            سحب جديد
                          </TabsTrigger>
                        </TabsList>
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                withdrawActions.map(withdrawAction => {
                  return (
                    <TableRow key={withdrawAction.id}>
                      <TableCell className='min-w-40'>
                        <Copy text={withdrawAction.id} className='inline ml-2' />
                        <span>{withdrawAction.id}</span>
                      </TableCell>
                      <TableCell className='min-w-40'>
                        {withdrawAction.shms_action_type === 'deposit'
                          ? 'إيداع رصيد'
                          : 'سحب رصيد'}
                      </TableCell>
                      <TableCell className='min-w-40'>
                        {getProjectDate(new Date(withdrawAction.shms_created_at))}
                      </TableCell>
                      <TableCell className='min-w-40' data-price>
                        {withdrawAction.shms_withdraw_amount}
                      </TableCell>
                      <TableCell
                        className={
                          withdrawAction.accounting_operation_status === 'pending'
                            ? 'text-yellow-500'
                            : withdrawAction.accounting_operation_status === 'completed'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }
                      >
                        {getProjectStatus(withdrawAction.accounting_operation_status)}
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

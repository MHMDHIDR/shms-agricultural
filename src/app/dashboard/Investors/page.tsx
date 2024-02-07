import Divider from '@/components/custom/Divider'
import Modal from '@/components/custom/Modal'
import NoRecords from '@/components/custom/NoRecords'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TabsContent } from '@/components/ui/tabs'
import { API_URL, APP_LOGO } from '@/data/constants'
import { arabicDate } from '@/lib/utils'
import type { ProjectProps, UserProps, stocksPurchesedProps } from '@/types'
import axios from 'axios'
import { Suspense } from 'react'

export default async function DashboardInvestors() {
  const { data: users }: { data: UserProps[] } = await axios.get(
    `${API_URL}/users/all?role=investor`
  )

  return (
    <TabsContent value='investors'>
      <div className='flex flex-wrap justify-center gap-2.5 my-4'>
        <Card className='w-full select-none font-bold text-center md:w-[350px]'>
          <CardHeader>
            <CardTitle>عدد المساهمين</CardTitle>
            <CardDescription className='pt-4 text-2xl'>
              <strong>{users.length}</strong>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className='w-full select-none font-bold text-center md:w-[300px]'>
          <CardHeader>
            <CardTitle>مجموع المبالغ المستثمرة</CardTitle>
            <CardDescription className='pt-4 text-2xl'>
              <strong>153</strong>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className='w-full select-none font-bold text-center md:w-[300px]'>
          <CardHeader>
            <CardTitle>عدد الاسهم</CardTitle>
            <CardDescription className='pt-4 text-2xl'>
              <strong>153</strong>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className='flex w-full'>
        <Card className='min-w-full md:w-[300px] rtl'>
          <CardHeader>
            <CardTitle>المستثمرين</CardTitle>
            {
              <CardDescription className='pt-2 text-l'>
                <small>
                  <strong>لديك {users.length} مستثمر</strong>
                </small>
              </CardDescription>
            }
          </CardHeader>
          <CardContent>
            {!users || users.length === 0 ? (
              <NoRecords msg='لم يتم العثور على مستثمرين في الوقت الحالي!' />
            ) : (
              <Table className='min-w-full divide-y divide-gray-200 overflow-x-auto'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='font-bold text-center select-none min-w-32'>
                      الاسم
                    </TableHead>
                    <TableHead className='font-bold text-center select-none'>
                      تفاصيل الأســــهــــم
                      <Divider />
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className='border border-gray-200 text-center select-none min-w-56'>
                              اسم المشروع
                            </TableHead>
                            <TableHead className='border border-gray-200 text-center select-none min-w-28'>
                              عدد الاسهم
                            </TableHead>
                            <TableHead className='border border-gray-200 text-center select-none min-w-36'>
                              نسبة زيادة الأرباح
                            </TableHead>
                            <TableHead className='border border-gray-200 text-center select-none min-w-28'>
                              إجمالي الدفع
                            </TableHead>
                            <TableHead className='border border-gray-200 text-center select-none min-w-60'>
                              تاريخ الشراء
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                      </Table>
                    </TableHead>
                    <TableHead className='font-bold text-center select-none'>
                      المستند الشخصي
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.shms_id}>
                      <TableCell className='text-center min-w-32'>
                        {user.shms_fullname}
                      </TableCell>
                      <TableCell className='text-center'>
                        <Suspense
                          fallback={
                            <div className='flex flex-col gap-y-1.5'>
                              <Skeleton className='w-full h-4' />
                              <Skeleton className='w-full h-4' />
                            </div>
                          }
                        >
                          {JSON.parse(String(user.shms_user_stocks)).map(
                            async (item: stocksPurchesedProps) => {
                              const projectName = (await getProject(item.shms_project_id))
                                .shms_project_name
                              const projectStockPrice = (
                                await getProject(item.shms_project_id)
                              ).shms_project_stock_price
                              return (
                                <div key={item.shms_project_id}>
                                  <Table>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className='text-center min-w-56'>
                                          {projectName}
                                        </TableCell>
                                        <TableCell className='text-center min-w-28'>
                                          {item.stocks}
                                        </TableCell>
                                        <TableCell className='text-center min-w-36'>
                                          {item.newPercentage}
                                        </TableCell>
                                        <TableCell
                                          className='text-center min-w-28'
                                          data-price
                                        >
                                          {item.stocks * projectStockPrice}
                                        </TableCell>
                                        <TableCell className='text-center min-w-60'>
                                          {arabicDate(item.createdAt)}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              )
                            }
                          )}
                        </Suspense>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Modal
                          title={`صورة المستند لــ ${user.shms_fullname}`}
                          document={user.shms_doc ?? APP_LOGO}
                          className='font-bold dark:text-white'
                        >
                          عرض المستند
                        </Modal>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )
}

async function getProject(projectId: ProjectProps['shms_project_id']) {
  const {
    data: { project }
  }: { data: { project: ProjectProps } } = await axios.get(
    `${API_URL}/projects/get/${projectId}`
  )

  return project
}

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
import { arabicDate, getProject } from '@/lib/utils'
import type { UserProps, stocksPurchasedProps } from '@/types'
import axios from 'axios'
import { Suspense } from 'react'
import PurchesedStocks from './_PurchesedStocks'

export default async function DashboardInvestors() {
  const { data: users }: { data: UserProps[] } = await axios.get(
    `${API_URL}/users/all?role=investor`
  )

  // Fetch project details for all users
  const fetchUserProjectDetails = async (userStocks: stocksPurchasedProps[]) => {
    const promises = userStocks.map(async (item: stocksPurchasedProps) => ({
      projectStockPrice: (await getProject(item.shms_project_id))
        .shms_project_stock_price,
      stocks: item.stocks
    }))
    return Promise.all(promises)
  }

  // Iterate through users to fetch project details for each
  const usersWithProjectDetails = await Promise.all(
    users.map(async user => {
      const userStocks: stocksPurchasedProps[] = JSON.parse(String(user.shms_user_stocks))
      const projectsDetails = await fetchUserProjectDetails(userStocks)

      return { ...user, projectsDetails }
    })
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
              <strong>
                {usersWithProjectDetails
                  .map(user => user.projectsDetails)
                  .flat()
                  .reduce((acc, cur) => acc + cur.stocks * cur.projectStockPrice, 0)}
              </strong>
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className='w-full select-none font-bold text-center md:w-[300px]'>
          <CardHeader>
            <CardTitle>عدد الاسهم</CardTitle>
            <CardDescription className='pt-4 text-2xl'>
              <strong>
                {usersWithProjectDetails
                  .map(user => user.projectsDetails)
                  .flat()
                  .reduce((acc, cur) => acc + cur.stocks, 0)}
              </strong>
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
              <Table className='min-w-full overflow-x-auto divide-y divide-gray-200'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='pt-10 font-bold text-center select-none min-w-56'>
                      الاسم
                    </TableHead>
                    <TableHead className='font-bold text-center select-none'>
                      تفاصيل الأســــهــــم
                      <Divider />
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className='text-center border border-gray-200 select-none min-w-56'>
                              اسم المشروع
                            </TableHead>
                            <TableHead className='text-center border border-gray-200 select-none min-w-28'>
                              عدد الاسهم
                            </TableHead>
                            <TableHead className='text-center border border-gray-200 select-none min-w-36'>
                              نسبة زيادة الأرباح
                            </TableHead>
                            <TableHead className='text-center border border-gray-200 select-none min-w-28'>
                              إجمالي الدفع
                            </TableHead>
                            <TableHead className='text-center border border-gray-200 select-none min-w-60'>
                              تاريخ الشراء
                            </TableHead>
                            <TableHead className='text-center border border-gray-200 select-none min-w-60'>
                              تعديل الأسهم
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                      </Table>
                    </TableHead>
                    <TableHead className='pt-10 font-bold text-center select-none'>
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
                            async (item: stocksPurchasedProps) => {
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
                                        <TableCell className='text-center'>
                                          <PurchesedStocks
                                            purchesedStocks={{
                                              item,
                                              userId: user.shms_id
                                            }}
                                          >
                                            تعديل أسهم المستثمر
                                          </PurchesedStocks>
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

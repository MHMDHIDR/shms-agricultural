import Link from 'next/link'
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
import { API_URL, APP_LOGO } from '@/data/constants'
import { arabicDate, formattedPrice, getProject } from '@/libs/utils'
import axios from 'axios'
import { Suspense } from 'react'
import PurchesedStocks from './investors/PurchesedStocks'
import Layout from '@/components/custom/Layout'
import DashboardNav from './DashboardNav'
import NotFound from '@/app/not-found'
import { getAuth } from '@/libs/actions/auth'
import { LoadingPage } from '@/components/custom/Loading'
import type { Stocks, Users } from '@prisma/client'

export default async function DashboardInvestors() {
  const { userType, loading } = await getAuth()
  const {
    data: users
  }: {
    data: Users[]
  } = await axios.get(`${API_URL}/users/all?role=investor`)

  const fetchUserProjectDetails = async (userStocks: Stocks[]) => {
    const promises = userStocks.map(async (item: Stocks) => {
      const project = await getProject(item.id)
      return {
        projectStockPrice: project?.shms_project_stock_price || 0,
        stocks: item.stocks
      }
    })
    return Promise.all(promises)
  }

  const usersWithProjectDetails = await Promise.all(
    users.map(async (user: Users) => {
      const userStocks: Stocks[] = user.shms_user_stocks || []
      const projectsDetails = await fetchUserProjectDetails(userStocks)

      return { ...user, projectsDetails }
    })
  )

  // Inside the totalInvestment calculation, add console logs to check projectStockPrice and stocks values
  const totalInvestment = usersWithProjectDetails.reduce((total, user) => {
    const userInvestment = user.projectsDetails.reduce((userTotal, project) => {
      // Add a check to ensure project.stocks is defined and numeric
      const stocks = typeof project.stocks === 'number' ? project.stocks : 0

      const projectInvestment = project.projectStockPrice * stocks
      return userTotal + projectInvestment
    }, 0)
    return total + userInvestment
  }, 0)

  return loading ? (
    <LoadingPage />
  ) : userType !== 'admin' ? (
    <NotFound />
  ) : (
    <Layout>
      <h1 className='mt-20 mb-10 text-2xl font-bold text-center'>لوحة التحكم</h1>
      <DashboardNav />

      <section className='container mx-auto'>
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
                <strong>{formattedPrice(totalInvestment)}</strong>
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
                    .reduce(
                      (acc, cur) =>
                        acc + (typeof cur.stocks === 'number' ? cur.stocks : 0),
                      0
                    )}
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
                              <TableHead className='text-center border border-gray-200 select-none min-w-64'>
                                تاريخ الشراء
                              </TableHead>
                              <TableHead className='text-center border border-gray-200 select-none min-w-40'>
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
                      <TableRow key={user.id}>
                        <TableCell className='text-center min-w-32'>
                          <Link href={`/dashboard/users/${user.id}`}>
                            {user.shms_fullname}
                          </Link>
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
                            {user.shms_user_stocks.map(async (item: Stocks) => {
                              const project = await getProject(item.id)
                              if (!project) {
                                return null // Exit early if project is null
                              }

                              const projectName = project.shms_project_name
                              const projectStockPrice = project.shms_project_stock_price

                              return (
                                <div key={item.id}>
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
                                        <TableCell className='text-center min-w-28'>
                                          {formattedPrice(
                                            item.stocks * projectStockPrice
                                          )}
                                        </TableCell>
                                        <TableCell className='text-center min-w-64'>
                                          {arabicDate(item.createdAt)}
                                        </TableCell>
                                        <TableCell className='text-center min-w-40'>
                                          <PurchesedStocks
                                            purchesedStocks={{ item, userId: user.id }}
                                          >
                                            تعديل الأسهم
                                          </PurchesedStocks>
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              )
                            })}
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
      </section>
    </Layout>
  )
}

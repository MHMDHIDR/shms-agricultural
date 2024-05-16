import Divider from '@/components/custom/Divider'
import Layout from '@/components/custom/Layout'
import NoRecords from '@/components/custom/NoRecords'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formattedPrice, getProject, getProjectDate, getUser } from '@/lib/utils'
import type { InverstorProjectData, UserProps, stocksPurchasedProps } from '@/types'
import Account from '@/app/profile/investments/account'
import { getAuth } from '@/lib/actions/auth'
import { LoadingPage } from '@/components/custom/Loading'
import NotFound from '@/app/not-found'
import Contract from '@/app/profile/investments/_ShowPDF'

export default async function DashboardInvestors({
  params: { userId }
}: {
  params: { userId: string }
}) {
  const { userType, loading } = await getAuth()

  // To make sure the user is the investor -- للتأكد من ان المستخدم هو المستثمر المطلوب
  const user = (await getUser(userId)) as UserProps
  const projectsData: stocksPurchasedProps[] = JSON.parse(String(user.shms_user_stocks))

  const projectDataFilter: InverstorProjectData[][] = await Promise.all(
    projectsData.map(async (projectData: stocksPurchasedProps) => {
      // Return an empty array if shms_project_id is missing
      if (!projectData.shms_project_id) return []
      const projectDetails = await getProject(projectData.shms_project_id)

      // Return an empty array if projectDetails is falsy
      if (!projectDetails) return []
      const {
        shms_project_name: projectName,
        shms_project_stock_price: projectStockPrice,
        shms_project_stock_profits: projectProfit,
        shms_project_profits_collect_date: profitCollectionDate,
        shms_project_terms: projectTerms
      } = projectDetails

      const totalProfit =
        projectData.newPercentage > 0
          ? projectData.stocks * projectProfit +
            (projectData.stocks * projectProfit * projectData.newPercentage) / 100
          : projectData.stocks * projectProfit

      const profitPerStock =
        projectData.newPercentage > 0
          ? projectProfit + (projectProfit * projectData.newPercentage) / 100
          : projectProfit

      const mappedProject: InverstorProjectData = {
        projectId: projectData.shms_project_id,
        projectName,
        projectStockPrice,
        stocks: projectData.stocks,
        totalPayment: projectData.stocks * projectStockPrice,
        profitCollectionDate,
        purchaseDate: projectData.createdAt,
        projectTerms,
        profitPerStock,
        totalProfit,
      }
      // Return an array containing the mapped project data
      return [mappedProject]
    })
  )

  return loading ? (
    <LoadingPage />
  ) : userType !== 'admin' ? (
    <NotFound />
  ) : (
    <Layout>
      <section className='container mx-auto'>
        <Account userId={userId} />
        <Card className='min-w-full md:w-[300px] rtl mt-12'>
          <CardContent>
            <CardHeader className='font-bold text-center'>
              تفاصيل الأســــهــــم
              <Divider />
            </CardHeader>
            {!projectsData || projectsData.length === 0 ? (
              <NoRecords
                msg='لا يوجد لديك استثمارات معنا! للبدأ في الاستثمار تصفح مشاريعنا'
                links={[{ to: `/projects`, label: 'تصفـــح مــشاريعـنا' }]}
              />
            ) : (
              <Table className='min-w-full overflow-x-auto divide-y divide-gray-200'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-center border border-gray-200 select-none min-w-56'>
                      اسم المشروع
                    </TableHead>
                    <TableHead className='text-center border border-gray-200 select-none min-w-28'>
                      عدد الاسهم
                    </TableHead>
                    <TableHead className='text-center border border-gray-200 select-none min-w-36'>
                      سعر السهم الواحد
                    </TableHead>
                    <TableHead className='text-center border border-gray-200 select-none min-w-28'>
                      إجمالي الدفع
                    </TableHead>
                    <TableHead className='text-center border border-gray-200 select-none min-w-56'>
                      إجمالي الربح من الأســــهــــم
                    </TableHead>
                    <TableHead className='text-center border border-gray-200 select-none min-w-60'>
                      الإجمالي من ربح الأسهم ورأس المال
                    </TableHead>
                    <TableHead className='text-center border border-gray-200 select-none min-w-60'>
                      تاريخ الشراء
                    </TableHead>
                    <TableHead className='text-center border border-gray-200 select-none min-w-60'>
                      تاريخ تسليم الأرباح
                    </TableHead>
                    <TableHead className='text-center border border-gray-200 select-none min-w-60'>
                      عرض العقد
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectDataFilter.map(projectData => {
                    return projectData.map(
                      ({
                        projectId,
                        projectName,
                        projectStockPrice,
                        stocks,
                        totalPayment,
                        profitCollectionDate,
                        purchaseDate,
                        projectTerms,
                        profitPerStock,
                        totalProfit
                      }) => {
                        const dataToShow = {
                          investorName: user?.shms_fullname,
                          investorPhone: user?.shms_phone,
                          investorEmail: user?.shms_email,
                          projectName,
                          stocksPurchased: stocks,
                          totalAmount: totalPayment,
                          profitPerStock,
                          totalProfit,
                          profitsCollectDate: profitCollectionDate,
                          purchaseDate,
                          projectTerms,
                          referenceCode: `#${
                            user?.shms_id
                          }#${projectId}#${new Date().getTime()}`
                        }
                        return (
                          <TableRow key={projectId}>
                            <TableCell className='text-center border border-gray-200'>
                              {projectName}
                            </TableCell>
                            <TableCell className='text-center border border-gray-200'>
                              {stocks}
                            </TableCell>
                            <TableCell className='text-center border border-gray-200'>
                              {formattedPrice(projectStockPrice)}
                            </TableCell>
                            <TableCell className='text-center border border-gray-200'>
                              {formattedPrice(totalPayment)}
                            </TableCell>
                            <TableCell className='text-center border border-gray-200'>
                              {formattedPrice(totalProfit)}
                            </TableCell>
                            <TableCell className='text-center border border-gray-200'>
                              {formattedPrice(totalProfit + totalPayment)}
                            </TableCell>
                            <TableCell className='text-center border border-gray-200'>
                              {getProjectDate(new Date(purchaseDate))}
                            </TableCell>
                            <TableCell className='text-center border border-gray-200'>
                              {getProjectDate(new Date(profitCollectionDate))}
                            </TableCell>
                            <TableCell className='text-center border border-gray-200'>
                              <Contract
                                dataToShow={{
                                  ...dataToShow,
                                  purchaseDate: new Date(purchaseDate),
                                  investorName: dataToShow.investorName || ''
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        )
                      }
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </Layout>
  )
}

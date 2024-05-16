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
import { API_URL } from '@/data/constants'
import { getAuth } from '@/lib/actions/auth'
import { formattedPrice, getProject, getProjectDate } from '@/lib/utils'
import type { InverstorProjectData, UserProps, stocksPurchasedProps } from '@/types'
import axios from 'axios'
import Contract from './_ShowPDF'
import Account from '@/app/profile/investments/account'
import { redirect } from 'next/navigation'

export default async function DashboardInvestors() {
  const { userId } = await getAuth()
  const { data: users }: { data: UserProps[] } = await axios.get(
    `${API_URL}/users/all?role=investor`
  )

  // To make sure the user is the investor -- للتأكد من ان المستخدم هو المستثمر المطلوب
  const InvestmentCurrentUser = users.filter(user => user.shms_id === userId)
  const projectsData: stocksPurchasedProps[][] = InvestmentCurrentUser.map(
    InvestmentData => JSON.parse(String(InvestmentData.shms_user_stocks))
  )

  const projectDataFilter: InverstorProjectData[][] = await Promise.all(
    projectsData.map(async projectData => {
      const mappedProjects = await Promise.all(
        projectData.map(async (project: stocksPurchasedProps) => {
          if (!project.shms_project_id) return null

          const projectDetails = await getProject(project.shms_project_id)
          if (!projectDetails) return null

          const {
            shms_project_name: projectName,
            shms_project_stock_price: projectStockPrice,
            shms_project_stock_profits: projectProfit,
            shms_project_profits_collect_date: profitCollectionDate,
            shms_project_terms: projectTerms
          } = projectDetails

          const totalProfit =
            project.newPercentage > 0
              ? project.stocks * projectProfit +
                (project.stocks * projectProfit * project.newPercentage) / 100
              : project.stocks * projectProfit

          const profitPerStock =
            project.newPercentage > 0
              ? projectProfit + (projectProfit * project.newPercentage) / 100
              : projectProfit

          const mappedProject: InverstorProjectData = {
            projectId: project.shms_project_id,
            projectName,
            projectStockPrice,
            stocks: project.stocks,
            totalPayment: project.stocks * projectStockPrice,
            profitCollectionDate,
            purchaseDate: project.createdAt,
            projectTerms,
            profitPerStock,
            totalProfit
          }

          return mappedProject
        })
      )

      // Filter out null values before returning
      return mappedProjects.filter(project => project !== null) as InverstorProjectData[]
    })
  )

  return !userId ? (
    redirect('/auth/signin')
  ) : (
    <Layout>
      <section className='container mx-auto'>
        <Account />
        <Card className='min-w-full md:w-[300px] rtl mt-12'>
          <CardContent>
            <CardHeader className='font-bold text-center'>
              تفاصيل الأســــهــــم
              <Divider />
            </CardHeader>
            {!InvestmentCurrentUser || InvestmentCurrentUser.length === 0 ? (
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
                          investorName: InvestmentCurrentUser[0]?.shms_fullname,
                          investorPhone: InvestmentCurrentUser[0]?.shms_phone,
                          investorEmail: InvestmentCurrentUser[0]?.shms_email,
                          projectName,
                          stocksPurchased: stocks,
                          totalAmount: totalPayment,
                          profitPerStock,
                          totalProfit,
                          profitsCollectDate: profitCollectionDate,
                          purchaseDate,
                          projectTerms,
                          referenceCode: `#${
                            InvestmentCurrentUser[0]?.shms_id
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

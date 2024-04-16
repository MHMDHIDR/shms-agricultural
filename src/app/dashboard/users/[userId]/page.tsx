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
import Account from '@/app/profile/investments/account/page'
import { redirect } from 'next/navigation'

export default async function DashboardInvestors({
  params: { userId }
}: {
  params: { userId: string }
}) {
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

      const mappedProject: InverstorProjectData = {
        projectId: projectData.shms_project_id,
        projectName,
        projectStockPrice,
        stocks: projectData.stocks,
        totalPayment: projectData.stocks * projectStockPrice,
        profitCollectionDate,
        purchaseDate: projectData.createdAt,
        projectTerms,
        totalProfit
      }
      // Return an array containing the mapped project data
      return [mappedProject]
    })
  )

  return !userId ? (
    redirect('/auth/signin')
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
                    {!userId ? (
                      <TableHead className='text-center border border-gray-200 select-none min-w-60'>
                        عرض العقد
                      </TableHead>
                    ) : null}
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
                        totalProfit
                      }) => (
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
                        </TableRow>
                      )
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
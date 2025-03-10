import {
  DollarSignIcon,
  Eye,
  HelpCircle,
  Link2Icon,
  PercentIcon,
  Plus,
  Tractor,
  Users,
  Wallet,
} from "lucide-react"
import Link from "next/link"
import { InvestmentChart } from "@/components/custom/investment-chart"
import NoRecords from "@/components/custom/no-records"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardLink,
  CardTitle,
} from "@/components/ui/card"
import { calculateInvestmentMetrics } from "@/lib/calculate-investment-metrics"
import { api } from "@/trpc/server"

export default async function AdminPage() {
  const { users, count: usersCount } = await api.user.getAll()
  const { count: investorsCount } = await api.user.getInvestors()
  const { projects, count: projectsCount } = await api.projects.getAll()
  const { count: operationsCount } = await api.operations.getAll()
  const activeSessions = await api.user.getActiveSessions()

  // Calculate total investments
  const totalInvestments = users.reduce((total, user) => {
    return (
      total +
      (user.stocks?.reduce((stockTotal, stock) => {
        const projectPrice = projects.find(p => p.id === stock.id)?.projectStockPrice ?? 0
        return stockTotal + stock.stocks * projectPrice
      }, 0) ?? 0)
    )
  }, 0)

  // Prepare data for investment chart
  const stockMetrics = users.flatMap(
    user =>
      user.stocks?.map(stock => {
        const project = projects.find(p => p.id === stock.id)
        return {
          stockId: stock.id,
          purchaseDate: stock.createdAt,
          profitCollectDate: project?.projectProfitsCollectDate ?? new Date(),
          numberOfStocks: stock.stocks,
          stockPrice: project?.projectStockPrice ?? 0,
          profitPerStock: project?.projectStockProfits ?? 0,
          specialPercentage: stock.newPercentage,
        }
      }) ?? [],
  )

  // Find date range for chart
  const dates = stockMetrics.reduce(
    (acc, stock) => {
      if (stock.purchaseDate < acc.startDate) {
        acc.startDate = stock.purchaseDate
      }
      if (stock.profitCollectDate > acc.endDate) {
        acc.endDate = stock.profitCollectDate
      }
      return acc
    },
    {
      startDate: new Date(),
      endDate: new Date(0),
    },
  )

  const investmentData = calculateInvestmentMetrics(stockMetrics, dates.startDate, dates.endDate)

  const quickLinks = [
    {
      title: "المشاريع",
      icon: Tractor,
      href: "/admin/projects",
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      bgColorHover: "hover:bg-blue-100/50",
      description: "إدارة المشاريع الاستثمارية",
    },
    {
      title: "المستخدمين",
      icon: Users,
      href: "/admin/users",
      color: "text-green-500",
      bgColor: "bg-green-100",
      bgColorHover: "hover:bg-green-100/50",
      description: "إدارة حسابات المستخدمين",
    },
    {
      title: "العمليات المالية",
      icon: DollarSignIcon,
      href: "/admin/operations",
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      bgColorHover: "hover:bg-purple-100/50",
      description: "متابعة العمليات المالية",
    },
    {
      title: "نسب الأرباح",
      icon: PercentIcon,
      href: "/admin/profits-percentage",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
      bgColorHover: "hover:bg-yellow-100/50",
      description: "إدارة نسب الأرباح",
    },
    {
      title: "إضافة مشروع",
      icon: Plus,
      href: "/admin/projects/new",
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
      bgColorHover: "hover:bg-indigo-100/50",
      description: "إضافة مشروع جديد",
    },
    {
      title: "عرض المشاريع",
      icon: Eye,
      href: "/admin/projects",
      color: "text-pink-500",
      bgColor: "bg-pink-100",
      bgColorHover: "hover:bg-pink-100/50",
      description: "عرض كافة المشاريع",
    },
    {
      title: "روابط التواصل",
      icon: Link2Icon,
      href: "/admin/social-links",
      color: "text-cyan-500",
      bgColor: "bg-cyan-100",
      bgColorHover: "hover:bg-cyan-100/50",
      description: "إدارة روابط التواصل الاجتماعي",
    },
    {
      title: "الأسئلة الشائعة",
      icon: HelpCircle,
      href: "/admin/faq",
      color: "text-orange-500",
      bgColor: "bg-orange-100",
      bgColorHover: "hover:bg-orange-100/50",
      description: "إدارة الأسئلة الشائعة",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-2xl font-bold select-none">لوحة التحكم</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <CardLink href="/admin/users">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount}</div>
            <p className="text-xs text-muted-foreground">مستخدم مسجل في النظام</p>
          </CardContent>
        </CardLink>

        <CardLink href="/admin/users">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المستثمرين</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investorsCount}</div>
            <p className="text-xs text-muted-foreground">مستثمر في المشاريع</p>
          </CardContent>
        </CardLink>

        <CardLink href="/admin/projects">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع النشطة</CardTitle>
            <Tractor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsCount}</div>
            <p className="text-xs text-muted-foreground">مشروع استثماري نشط</p>
          </CardContent>
        </CardLink>

        <CardLink href="/admin/operations">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الاستثمارات</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalInvestments.toLocaleString("ar-QA")} ريال
            </div>
            <p className="text-xs text-muted-foreground">قيمة الاستثمارات الكلية</p>
          </CardContent>
        </CardLink>

        <CardLink href="/admin/operations">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العمليات المالية</CardTitle>
            <PercentIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationsCount}</div>
            <p className="text-xs text-muted-foreground">عملية مالية مسجلة</p>
          </CardContent>
        </CardLink>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>نمو الاستثمارات</CardTitle>
          </CardHeader>
          <CardContent>
            {stockMetrics.length > 0 ? (
              <InvestmentChart
                data={investmentData}
                profitCollectDate={dates.endDate}
                MAX_POINTS={8}
              />
            ) : (
              <div className="flex justify-center items-center h-60">
                <p className="text-muted-foreground">لا توجد بيانات استثمارية لعرضها</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>المستخدمين النشطين</CardTitle>
          </CardHeader>
          <CardContent>
            {activeSessions && activeSessions.length > 0 ? (
              <div className="grid gap-4">
                {activeSessions.map(session => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{session.user.name}</p>
                        <p className="text-sm text-muted-foreground">{session.user.email}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      آخر نشاط: {new Date(session.expires).toLocaleString("ar-QA")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <NoRecords msg="لم يتم العثور على أي مستخدمين نشطين في الوقت الحالي" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {quickLinks.map((link, index) => (
          <Link key={index} href={link.href} className="inline-block">
            <Card
              className={`${link.bgColorHover} transition-colors cursor-pointer ${link.bgColor}`}
            >
              <CardHeader className={`flex flex-row gap-x-2 pb-2 pt-4`}>
                <link.icon className={`h-6 w-6 ${link.color}`} />
                <CardTitle className="text-lg whitespace-nowrap">{link.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <CardDescription className="text-sm text-muted-foreground whitespace-nowrap">
                  {link.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

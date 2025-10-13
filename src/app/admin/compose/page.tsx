import { Suspense } from "react"
import { EmailEditor } from "@/components/custom/email/email-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/trpc/server"

async function EmailList() {
  const { users } = await api.user.getAll()
  const { investors } = await api.user.getInvestors()

  // Create a map to track unique users and their investor status
  const uniqueUsersMap = new Map()

  // Add all users first
  users.forEach(user => {
    uniqueUsersMap.set(user.email, {
      email: user.email,
      name: user.name,
      isInvestor: false,
    })
  })

  // const testingEmailList = [
  //   {
  //     email: "mr.hamood277@gmail.com",
  //     name: "محمد حيدر",
  //     isInvestor: false,
  //   },
  //   {
  //     email: "soft.eng.mohammed@gmail.com",
  //     name: "محمد بشير",
  //     isInvestor: true,
  //   },
  // ]

  // Update or add investors, marking them as investors
  investors.forEach(investor => {
    uniqueUsersMap.set(investor.email, {
      email: investor.email,
      name: investor.name,
      isInvestor: true,
    })
  })

  const emailsList = Array.from(uniqueUsersMap.values())

  return <EmailEditor emailList={emailsList} />
}

export default function ComposeNewsletterPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="select-none text-center font-bold">
            إنشاء نشرة بريدية جديدة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            }
          >
            <EmailList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

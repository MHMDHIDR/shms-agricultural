import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import Divider from "@/components/custom/divider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import { translateSring } from "@/lib/translate-string"
import { auth } from "@/server/auth"
import { SignInForm } from "./signin-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `تسجيل الدخول | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const session = await auth()
  const user = session?.user
  const searchParamsProp = await searchParams
  const callbackUrl = searchParamsProp.callbackUrl
  const callbackUrlPageName =
    callbackUrl?.split("step=")[1] ?? callbackUrl?.replace("/", "") ?? "هذه الصفحة"

  if (user) {
    if (callbackUrl) {
      redirect(decodeURIComponent(callbackUrl))
    }

    // Otherwise, use role-based redirects
    if (user.role === "admin") {
      redirect("/admin")
    } else {
      redirect("/dashboard")
    }
  }

  return (
    <div className="container mx-auto max-w-md px-2.5 py-12">
      {callbackUrl && (
        <Card className="mb-4 select-none flex items-center gap-x-3 rounded-lg border-l-4 border-l-red-500 bg-red-50 p-2.5 dark:bg-red-950/50">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardHeader className="flex flex-col p-0">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
              تنبيه الوصول
            </CardTitle>
            <CardContent className="p-0">
              <p className="text-sm text-red-600 dark:text-red-300">
                يجب عليك تسجيل الدخول للوصول إلى {translateSring(callbackUrlPageName)}
              </p>
            </CardContent>
          </CardHeader>
        </Card>
      )}
      <h1 className="mb-14 text-center text-2xl font-bold select-none">تسجيل الدخول</h1>
      <SignInForm />
      <Divider className="my-10">أو</Divider>

      <div className="divide-primary flex items-center justify-center gap-x-4 divide-x divide-dotted select-none">
        <div className="flex items-center gap-x-4 pl-3">
          <h2 className="text-sm">ليس لديك حساب؟</h2>
          <Link
            href="/signup"
            className="bg-primary text-xs sm:text-base hover:bg-primary/90 rounded-md px-4 py-2 text-white whitespace-nowrap"
          >
            سجل الآن
          </Link>
        </div>

        <Link
          href="/forgot-password"
          className="text-primary text-xs sm:text-base hover:text-primary/70 hover:underline hover:underline-offset-4 whitespace-nowrap"
        >
          نسيت كلمة المرور؟
        </Link>
      </div>
    </div>
  )
}

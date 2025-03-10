import { redirect } from "next/navigation"
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants"
import { auth } from "@/server/auth"
import { api } from "@/trpc/server"
import { SignUpForm } from "./signup-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `تسجيل حساب جديد | ${APP_TITLE}`,
  description: APP_DESCRIPTION,
}

export default async function SignInPage() {
  const session = await auth()
  const user = session?.user

  if (user?.role === "admin") {
    redirect("/admin")
  } else if (user?.role === "user") {
    redirect("/dashboard")
  }

  const { users } = await api.user.getAll()
  const sn = (users?.map(user => user.sn).sort((a, b) => b - a)[0] ?? 0) + 1

  return (
    <div className="container mx-auto max-w-md px-2.5 py-20">
      <h1 className="mb-14 text-center text-2xl font-bold select-none">تسجيل حساب جديد</h1>
      <SignUpForm sn={sn} />
    </div>
  )
}

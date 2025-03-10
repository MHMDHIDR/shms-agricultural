import { notFound, redirect } from "next/navigation"
import { validateToken } from "@/lib/validate-token"
import { auth } from "@/server/auth"
import NewPasswordForm from "./new-password-form"

export default async function NewPassword({ params }: { params: Promise<{ token: string }> }) {
  const session = await auth()
  const user = session?.user

  if (user?.role === "admin") {
    redirect("/admin")
  } else if (user?.role === "user") {
    redirect("/dashboard")
  }

  const { token } = await params
  if (!token || !validateToken(token)) notFound()

  return <NewPasswordForm token={token} />
}

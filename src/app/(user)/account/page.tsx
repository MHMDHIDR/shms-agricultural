import { notFound } from "next/navigation"
import NoRecords from "@/components/custom/no-records"
import { auth } from "@/server/auth"
import { api } from "@/trpc/server"
import { AccountForm } from "./account-form"

export default async function AccountPage() {
  const session = await auth()
  const user = session?.user

  if (!user?.id) {
    notFound()
  }

  const userData = await api.user.getUserById({ id: user.id })

  return !userData ? (
    <NoRecords
      msg="عفواً لم يتم العثور على المستخدم!"
      links={[{ to: `/`, label: "الصفحة الرئيسية" }]}
    />
  ) : (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="mb-8 text-center text-2xl font-bold select-none">إدارة الحساب</h1>
      <AccountForm user={userData} />
    </div>
  )
}

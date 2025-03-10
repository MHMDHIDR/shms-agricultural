"use client"

import clsx from "clsx"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LoadingCard } from "@/components/custom/loading"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { APP_CURRENCY } from "@/lib/constants"
import { api } from "@/trpc/react"
import type { Projects } from "@prisma/client"

type PurchaseData = {
  projectId: string
  stocks: number
  percentageCode: string
  newPercentage: number
  totalPayment: number
  totalProfit: number
  totalReturn: number
}

export function PurchaseConfirmation({ project }: { project: Projects }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  // const projectInvestmentDisabled =
  //   project.projectAvailableStocks === 0 ||
  //   project.projectStatus === "pending" ||
  //   project.projectInvestDate < new Date()

  // Fetch user data
  const { data: userData, isLoading: isLoadingUser } = api.user.getUserById.useQuery(
    { id: session?.user?.id ?? "" },
    { enabled: !!session?.user?.id },
  )

  const { mutate: confirmPurchase, isPending } = api.projects.confirmPurchase.useMutation({
    onSuccess: () => {
      // Clear purchase data from localStorage
      localStorage.removeItem("purchase_data")
      toast.success(
        `تم شراء ${purchaseData?.stocks} سهم من المشروع ${project.projectName} بنجاح بمبلغ ${purchaseData?.totalPayment} ${APP_CURRENCY}`,
      )
      router.push(`/dashboard`)
    },
  })

  useEffect(() => {
    const savedData = localStorage.getItem("purchase_data")
    if (!savedData) {
      router.push(`/projects/${project.id}?step=purchase`)
      return
    }

    const parsedData = JSON.parse(savedData) as PurchaseData
    setPurchaseData(parsedData)
    setIsLoading(false)
  }, [project.id, router])

  // useEffect(() => {
  //   if (projectInvestmentDisabled) {
  //     router.replace(`/projects`)
  //   }
  // }, [projectInvestmentDisabled, router])

  if (isLoading || isLoadingUser || !purchaseData) {
    return <LoadingCard renderedSkeletons={10} />
  }

  // if (projectInvestmentDisabled) {
  //   return null
  // }

  return (
    <div className="max-w-2xl mx-auto space-y-8 select-none">
      <h2 className="text-base md:text-xl font-bold text-center">تأكيد معلومات الشراء</h2>

      <div className="space-y-5 bg-muted p-3.5 rounded-lg">
        <div className="space-y-4">
          <h3 className="text-sm md:text-lg font-semibold">معلومات المشروع</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">اسم المشروع:</span>
              <p className="font-medium">{project.projectName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">الموقع:</span>
              <p className="font-medium">{project.projectLocation}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm md:text-lg font-semibold">تفاصيل الشراء</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">عدد الأسهم:</span>
              <p className="font-medium">{purchaseData.stocks}</p>
            </div>
            <div>
              <span className="text-muted-foreground">سعر السهم:</span>
              <p className="font-medium">
                {project.projectStockPrice} {APP_CURRENCY}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">إجمالي الدفع:</span>
              <p className="font-medium">
                {purchaseData.totalPayment} {APP_CURRENCY}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">الربح المتوقع:</span>
              <p className="font-medium">
                {purchaseData.totalProfit} {APP_CURRENCY}
                {purchaseData.newPercentage > 0 && (
                  <span className="text-green-600 text-sm mr-2">
                    (زيادة {purchaseData.newPercentage}%)
                  </span>
                )}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">العائد الإجمالي:</span>
              <p className="font-medium">
                {purchaseData.totalReturn} {APP_CURRENCY}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm md:text-lg font-semibold">معلومات المستثمر</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground">الاسم:</span>
              <p className="font-medium">{userData?.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">البريد الإلكتروني:</span>
              <p className="font-medium">{userData?.email}</p>
            </div>
            <div>
              <span className="text-muted-foreground">رقم الهاتف:</span>
              <p className="font-medium">{userData?.phone}</p>
            </div>
          </div>

          <div>
            <span className="text-muted-foreground block mb-2">المستند:</span>
            <iframe src={userData?.doc} className="w-full h-78 rounded-md border" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          variant="outline"
          onClick={() => router.push(`/projects/${project.id}?step=purchase`)}
          disabled={isPending}
        >
          تعديل البيانات
        </Button>
        <Button
          onClick={() => confirmPurchase(purchaseData)}
          disabled={isPending}
          className={clsx("cursor-pointer", {
            "cursor-progress": isPending,
          })}
        >
          {isPending ? "جاري التأكيد..." : "تأكيد الشراء"}
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TermsDialog } from "@/components/custom/projects/terms-dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { APP_CURRENCY } from "@/lib/constants"
import { api } from "@/trpc/react"
import { LoadingCard } from "../loading"
import type { Projects } from "@prisma/client"

export function StockPurchaseForm({ project }: { project: Projects }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [selectedStocks, setSelectedStocks] = useState(0)
  const [percentageCode, setPercentageCode] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [newPercentage, setNewPercentage] = useState(0)
  const [showTerms, setShowTerms] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // const projectInvestmentDisabled =
  //   project.projectAvailableStocks === 0 ||
  //   project.projectStatus === "pending" ||
  //   project.projectInvestDate < new Date()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { data: userData, isLoading: isLoadingUser } = api.user.getUserById.useQuery(
    { id: session?.user?.id ?? "" },
    { enabled: !!session?.user?.id, retry: 1 },
  )

  const { mutate: validateCode, isPending: isValidating } =
    api.projects.validatePercentageCode.useMutation({
      onSuccess: data => {
        setNewPercentage(data.percentage)
      },
    })

  // Handle project investment disabled state
  // useEffect(() => {
  //   if (projectInvestmentDisabled) {
  //     router.replace(`/projects`)
  //   }
  // }, [projectInvestmentDisabled, router])

  // Show loading state during initial client-side render
  if (!isClient || status === "loading" || isLoadingUser) {
    return <LoadingCard renderedSkeletons={8} className="h-28" />
  }

  // if (projectInvestmentDisabled) {
  //   return null
  // }

  // Calculate available stocks using userData instead of session
  const purchasedStocksForProject =
    userData?.stocks
      ?.filter(stock => stock.id === project.id)
      .reduce((acc, curr) => acc + curr.stocks, 0) ?? 0

  const remainingUserLimit = userData?.stockLimit
    ? userData.stockLimit - purchasedStocksForProject
    : 0

  const maxPurchaseAmount = Math.min(remainingUserLimit, project.projectAvailableStocks)

  const baseProfit = selectedStocks * project.projectStockProfits
  const bonusProfit = (baseProfit * newPercentage) / 100
  const totalProfit = baseProfit + bonusProfit
  const totalPayment = selectedStocks * project.projectStockPrice
  const totalReturn = totalPayment + totalProfit

  if (status === "unauthenticated") {
    const currentPath = `/projects/${project.id}?step=purchase`
    const signInUrl = `/signin?callbackUrl=${encodeURIComponent(currentPath)}`
    window.location.href = signInUrl
    return null
  }

  // Handle missing user data
  if (!userData) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptedTerms || selectedStocks === 0) return

    // Store purchase data in localStorage for confirmation step
    localStorage.setItem(
      "purchase_data",
      JSON.stringify({
        projectId: project.id,
        stocks: selectedStocks,
        percentageCode,
        newPercentage,
        totalPayment,
        totalProfit,
        totalReturn,
        userData: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          doc: userData.doc,
        },
      }),
    )

    router.push(`/projects/${project.id}?step=confirm`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto select-none">
      <div className="space-y-4">
        <div>
          <Label>اسم المشروع</Label>
          <div className="p-2 border rounded mt-1">{project.projectName}</div>
        </div>

        <div>
          <Label>قيمة السهم الواحد</Label>
          <div className="p-2 border rounded mt-1">
            {project.projectStockPrice} {APP_CURRENCY}
          </div>
        </div>

        <div>
          <Label>اختيار عدد الأسهم</Label>
          <Select
            dir="rtl"
            onValueChange={value => setSelectedStocks(Number(value))}
            value={String(selectedStocks)}
            disabled={maxPurchaseAmount === 0}
          >
            <SelectTrigger className="w-full border-gray-900">
              <SelectValue
                placeholder={maxPurchaseAmount === 0 ? "غير متاح" : "اختيار عدد الأسهم"}
              />
            </SelectTrigger>
            <SelectContent avoidCollisions={false}>
              {Array.from({ length: maxPurchaseAmount }, (_, i) => (
                <SelectItem className="font-bold" key={i + 1} value={String(i + 1)}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            {maxPurchaseAmount === 0
              ? "لا يوجد أسهم متاحة"
              : `يمكنك شراء حتى ${maxPurchaseAmount} سهم`}
          </p>
        </div>

        <div>
          <Label>رمز خاص لزيادة النسبة (اختياري)</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={percentageCode}
              onChange={e => setPercentageCode(e.target.value)}
              placeholder="أدخل الرمز"
            />
            <Button
              type="button"
              onClick={() => validateCode({ projectId: project.id, code: percentageCode })}
              disabled={!percentageCode || isValidating}
            >
              تحقق
            </Button>
          </div>
        </div>

        <div>
          <Label>إجمالي الدفع</Label>
          <div className="p-2 border rounded mt-1">
            {totalPayment} {APP_CURRENCY}
          </div>
        </div>

        <div>
          <Label>الربح المتوقع</Label>
          <div className="p-2 border rounded mt-1">
            {totalProfit} {APP_CURRENCY}
            {newPercentage > 0 && (
              <span className="text-green-600 text-sm mr-2">(زيادة {newPercentage}%)</span>
            )}
          </div>
        </div>

        <div>
          <Label>العائد الإجمالي مع رأس المال</Label>
          <div className="p-2 border rounded mt-1">
            {totalReturn} {APP_CURRENCY}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="terms"
            className="cursor-pointer"
            checked={acceptedTerms}
            onClick={() => setShowTerms(true)}
          />
          <Label htmlFor="terms" className="text-sm cursor-pointer">
            أوافق على{" "}
            <Button
              type="button"
              variant={"link"}
              className="cursor-pointer"
              onClick={() => setShowTerms(true)}
            >
              <strong>شروط المشروع</strong>
            </Button>
          </Label>
        </div>
      </div>

      <TermsDialog
        open={showTerms}
        onOpenChange={setShowTerms}
        terms={project.projectTerms}
        onAccept={() => setAcceptedTerms(true)}
      />

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={!acceptedTerms || selectedStocks === 0}
      >
        متابعة
      </Button>
    </form>
  )
}

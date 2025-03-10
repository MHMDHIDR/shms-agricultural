"use client"

import clsx from "clsx"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "@/components/ui/button"
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import { useIsMobile } from "@/hooks/use-mobile"
import { Info } from "./info"
import { ProjectIntro } from "./intro"
import { PurchaseConfirmation } from "./purchase-confirmation"
import { StockPurchaseForm } from "./stock-purchase-form"
import type { Projects } from "@prisma/client"

function getProjectDuration(projectStartDate: Date, projectEndDate: Date): string {
  const startDate = new Date(projectStartDate)
  const endDate = new Date(projectEndDate)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30))
  return diffMonths > 2 ? `${diffMonths} أشهر` : `${diffMonths} شهور`
}

const steps = [
  {
    id: "info",
    title: "معلومات المشروع",
    description: "تفاصيل وشروط المشروع",
  },
  {
    id: "purchase",
    title: "شراء الأسهم",
    description: "اختيار عدد الأسهم",
  },
  {
    id: "confirm",
    title: "تأكيد الشراء",
    description: "مراجعة وتأكيد البيانات",
  },
] as const

export function ProjectStepper({
  project,
  currentStep,
  projectId,
}: {
  project: Projects
  currentStep: string
  projectId: string
}) {
  const { data: session } = useSession()
  const sessionRole = session?.user?.role

  const router = useRouter()
  const stepIndex = steps.findIndex(s => s.id === currentStep)
  const purchaseData = typeof window !== "undefined" ? localStorage.getItem("purchase_data") : null

  const canAccessStep = (stepToCheck: string) => {
    const stepIdx = steps.findIndex(step => step.id === stepToCheck)
    const currentIdx = steps.findIndex(step => step.id === currentStep)

    // Can always go back
    if (stepIdx < currentIdx) return true

    // Can't skip steps
    if (stepIdx > currentIdx + 1) return false

    // Can't access purchase/confirm without auth
    if ((stepToCheck === "purchase" || stepToCheck === "confirm") && !session) return false

    // Can't access confirm without purchase data
    if (stepToCheck === "confirm" && !purchaseData) return false

    return true
  }

  const isMobile = useIsMobile()

  return (
    <div className="space-y-8 w-full">
      <Stepper
        value={stepIndex}
        onValueChange={index => {
          const step = steps[index]
          if (step && canAccessStep(step.id)) {
            router.push(`/projects/${projectId}?step=${step.id}`)
          }
        }}
        className={clsx(
          "gap-x-2 w-full items-center mx-auto",
          isMobile ? "flex-col" : "justify-center",
        )}
        orientation={isMobile ? "vertical" : "horizontal"}
      >
        {steps.map(({ id, title, description }) => (
          <StepperItem
            key={id}
            step={steps.findIndex(s => s.id === id)}
            disabled={!canAccessStep(id)}
            className="cursor-pointer"
          >
            <StepperTrigger>
              <StepperIndicator />
              <div>
                <StepperTitle className="font-bold">{title}</StepperTitle>
                <StepperDescription>{description}</StepperDescription>
              </div>
            </StepperTrigger>
            {id !== steps[steps.length - 1]?.id && (
              <StepperSeparator className={isMobile ? "h-4" : "md:mx-4"} />
            )}
          </StepperItem>
        ))}
      </Stepper>

      {sessionRole === "admin" && (
        <Link href={`/admin/projects/${project.id}`} className="block text-center">
          <Button variant={"pressable"} size={"sm"} className="cursor-pointer text-xs px-1.5">
            تعديل المشروع
          </Button>
        </Link>
      )}

      <div className="mt-8 px-3.5">
        {currentStep === "info" && (
          <>
            <ProjectIntro project={project} />
            <Info
              project={{
                ...project,
                projectDuration: getProjectDuration(
                  project.projectStartDate,
                  project.projectEndDate,
                ),
              }}
            />
          </>
        )}

        {currentStep === "purchase" && <StockPurchaseForm project={project} />}
        {currentStep === "confirm" && <PurchaseConfirmation project={project} />}
      </div>
    </div>
  )
}

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { useIsMobile } from "@/hooks/use-mobile"
import { APP_CURRENCY } from "@/lib/constants"
import { formatDate } from "@/lib/format-date"
import { getProjectImages } from "@/lib/get-project-images"
import type { Projects } from "@prisma/client"

export function Info({ project }: { project: Projects & { projectDuration: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedStudyCase, setSelectedStudyCase] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState("0")
  const isMobile = useIsMobile()

  const selectedImages = getProjectImages(project.projectImages)

  const properties = [
    { name: "projectProfitsCollectDate" as const, title: "تاريخ جمع الأرباح" },
    { name: "projectLocation" as const, title: "موقع المشروع" },
    { name: "projectStockPrice" as const, title: "قيمة السهم الواحد" },
    { name: "projectStockProfits" as const, title: "أرباح الأسهم" },
    { name: "projectDuration" as const, title: "مدة المشروع" },
  ] as const

  function getPropertyValue(propertyName: (typeof properties)[number]["name"]) {
    if (propertyName === "projectProfitsCollectDate") {
      return formatDate({ date: project[propertyName].toISOString() })
    }
    return project[propertyName]?.toString() ?? ""
  }

  function addCurrencySuffix(value: number | string) {
    return Number(value) ? `${value} ${APP_CURRENCY}` : value
  }

  const projectCompletedPercentage = Number(
    Math.min(
      Math.round(
        100 - (project.projectAvailableStocks / project.projectTotalStocks) * 100 < 100
          ? 100 - (project.projectAvailableStocks / project.projectTotalStocks) * 100 + 1
          : 100 - (project.projectAvailableStocks / project.projectTotalStocks) * 100,
      ),
      100,
    ),
  )

  const handleStartInvestment = () => {
    if (!session?.user) {
      const callbackUrl = encodeURIComponent(`/projects/${project.id}?step=purchase`)
      router.push(`/signin?callbackUrl=${callbackUrl}`)
      return
    }

    router.push(`/projects/${project.id}?step=purchase`)
  }

  const handleStudyCaseClick = () => {
    if (project.projectStudyCaseVisibility && project.projectStudyCase?.[0]?.imgDisplayPath) {
      if (!isMobile) {
        setSelectedStudyCase(project.projectStudyCase[0].imgDisplayPath)
      }
    }
  }

  return (
    <section className="container mx-auto py-14">
      <div className="my-10">
        <h2 className="text-xl text-center select-none font-bold mb-6">معلومات عن المشروع</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px overflow-hidden rounded-xl border bg-border">
          <div className="lg:col-span-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full">
              {properties.map((property, index) => (
                <TabsContent
                  value={index.toString()}
                  key={property.name}
                  className="flex relative flex-col gap-2.5 select-none bg-background data-[state=inactive]:hidden h-full"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                  <div className="flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-end md:justify-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-lg md:text-2xl font-bold rounded-full text-white"
                      dir="auto"
                    >
                      {addCurrencySuffix(getPropertyValue(property.name))}
                    </Badge>
                  </div>
                  {selectedImages.length > 0 && (
                    <Image
                      src={selectedImages[index % selectedImages.length]?.imgDisplayPath ?? ""}
                      alt="Project Image"
                      className="aspect-video max-h-[450px] min-w-full rounded-l-xl object-cover"
                      height={450}
                      width={800}
                      draggable={false}
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="flex flex-col gap-px bg-border select-none lg:col-span-1">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="flex flex-col gap-px">
                {properties.map((property, index) => (
                  <TabsTrigger
                    key={property.name}
                    value={index.toString()}
                    className="flex-1 group justify-center relative flex cursor-pointer flex-col bg-muted p-4 transition-colors duration-300 data-[state=active]:bg-background"
                  >
                    <span className="absolute bottom-0 left-0 top-0 h-full w-[3px] bg-primary transition-opacity duration-300 group-data-[state=inactive]:opacity-0"></span>
                    <div className="flex w-full items-center justify-center">
                      <span className="font-medium">{property.title}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {project.projectStudyCaseVisibility &&
              project.projectStudyCase?.[0]?.imgDisplayPath &&
              (isMobile ? (
                <Link
                  href={project.projectStudyCase[0].imgDisplayPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 group justify-center relative flex cursor-pointer flex-col bg-muted p-4 transition-colors duration-300 hover:bg-background"
                >
                  <span className="absolute bottom-0 left-0 top-0 h-full w-[3px] bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  <div className="flex w-full items-center justify-center">
                    <span className="font-medium">عرض دراسة الجدوى</span>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={handleStudyCaseClick}
                  className="flex-1 group justify-center relative flex cursor-pointer flex-col bg-muted p-4 transition-colors duration-300 hover:bg-background"
                >
                  <span className="absolute bottom-0 left-0 top-0 h-full w-[3px] bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  <div className="flex w-full items-center justify-center">
                    <span className="font-medium">عرض دراسة الجدوى</span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>

      {!isMobile && selectedStudyCase && (
        <Dialog open={!!selectedStudyCase} onOpenChange={() => setSelectedStudyCase(null)}>
          <DialogContent className="w-[90vw] h-[95vh] p-0">
            <DialogHeader className="sr-only">
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="w-full h-full overflow-hidden bg-white">
              <iframe src={selectedStudyCase} className="w-full h-full" title="Study Case" />
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="my-10">
        <h2 className="text-xl text-center select-none font-bold mb-6">نسبة إكتمال المشروع</h2>
        <div className="flex flex-col items-center justify-center w-full my-6">
          <Slider
            defaultValue={[projectCompletedPercentage]}
            max={100}
            step={1}
            className="w-[60%]"
            disabled
          />
          <span className="mt-4 text-2xl font-bold text-green-600 select-none">
            {projectCompletedPercentage}%
          </span>
        </div>

        <div className="flex flex-col justify-center items-center bg-background p-10 gap-6 select-none rounded-xl">
          <p className="md:text-xl text-lg font-extrabold leading-loose text-muted-foreground mb-4">
            إبدأ ببناء المستقبل، استثمر في هذا المشروع الآن
          </p>
          <Button variant="pressable" className="w-fit" onClick={handleStartInvestment}>
            إبدأ الاستثمار
          </Button>
        </div>
      </div>
    </section>
  )
}

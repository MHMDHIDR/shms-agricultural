"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/trpc/react"
import type { Projects } from "@prisma/client"

const profitsPercentageSchema = z.object({
  projectId: z.string().min(1, "الرجاء اختيار المشروع"),
  percentage: z.number().min(0).max(100),
  percentageCode: z.string().min(1),
})

type ProfitsPercentageFormValues = z.infer<typeof profitsPercentageSchema>

export default function ProfitsPercentageForm({ projects }: { projects: Projects[] }) {
  const toast = useToast()
  const router = useRouter()
  const utils = api.useUtils()

  const form = useForm<ProfitsPercentageFormValues>({
    resolver: zodResolver(profitsPercentageSchema),
    defaultValues: {
      projectId: "",
      percentage: 0,
      percentageCode: "",
    },
  })

  const { mutate: updateProfitsPercentage, isPending: isUpdating } =
    api.projects.updateProfitsPercentage.useMutation({
      onSuccess: async () => {
        toast.success("تم تحديث نسبة الربح بنجاح")
        form.reset()
        await utils.projects.getAll.invalidate()
        router.refresh()
      },
      onError: error => {
        toast.error(error.message || "حدث خطأ ما")
      },
    })

  const generatePercentageCode = () => {
    return Math.random().toString(36).substring(2, 9).toUpperCase()
  }

  const selectedProjectData = form.watch("projectId")
    ? projects.find(project => project.id === form.watch("projectId"))
    : null

  const onSubmit = (values: ProfitsPercentageFormValues) => {
    updateProfitsPercentage(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-3.5 space-y-6 mb-10" dir="rtl">
        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs select-none">اختر المشروع</FormLabel>
              <Select
                value={field.value}
                onValueChange={value => {
                  field.onChange(value)
                  form.setValue("percentageCode", generatePercentageCode())
                }}
              >
                <FormControl>
                  <SelectTrigger className="cursor-pointer" dir="auto">
                    <SelectValue placeholder="اختر المشروع" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent dir="auto">
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id} className="cursor-pointer">
                      {project.projectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel className="text-xs select-none">رمز زيادة النسبة</FormLabel>
          <span className="inline-block min-h-8 w-full rounded border border-gray-900 bg-white px-4 py-2 leading-tight font-bold text-gray-700 select-none dark:bg-gray-800 dark:text-gray-300">
            {form.watch("percentageCode")}
          </span>
        </FormItem>

        <FormField
          control={form.control}
          name="percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs select-none">النسبة المئوية</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="15"
                  min="0"
                  max="100"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                  onWheel={e => e.currentTarget.blur()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel className="text-xs select-none">الربح الحالي</FormLabel>
          <span className="inline-block w-full rounded border border-gray-900 bg-white px-4 py-2 leading-tight font-bold text-gray-700 select-none dark:bg-gray-800 dark:text-gray-300">
            {selectedProjectData?.projectStockProfits ?? 0}
          </span>
        </FormItem>

        <FormItem>
          <FormLabel className="text-xs select-none">الربح الجديد</FormLabel>
          <span className="inline-block w-full rounded border border-gray-900 bg-white px-4 py-2 leading-tight font-bold text-gray-700 select-none dark:bg-gray-800 dark:text-gray-300">
            {selectedProjectData
              ? selectedProjectData.projectStockProfits +
                (selectedProjectData.projectStockProfits * form.watch("percentage")) / 100
              : 0}
          </span>
        </FormItem>

        <Button
          type="submit"
          disabled={isUpdating || !form.formState.isValid}
          className="w-full cursor-pointer"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ"
          )}
        </Button>
      </form>
    </Form>
  )
}

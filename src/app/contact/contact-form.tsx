"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { redirect, useSearchParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { contactSchema, services } from "@/schemas/contact"
import { api } from "@/trpc/react"
import type { ContactFormData } from "@/schemas/contact"
import type { SubmitHandler } from "react-hook-form"

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  })
  const toast = useToast()
  const service = useSearchParams().get("service")

  const sendMessageMutation = api.contact.sendMessage.useMutation({
    onSuccess: () => {
      toast.success("تم إرسال الرسالة بنجاح")
      reset()
    },
    onError: error => {
      toast.error(error.message || "حدث خطأ ما")
    },
  })

  const onSubmit: SubmitHandler<ContactFormData> = async data => {
    try {
      await sendMessageMutation.mutateAsync(data)
      setTimeout(() => redirect("/"), 2500)
    } catch (error) {
      console.error("Submission error", error)
    }
  }

  return (
    <form
      className="w-full max-w-3xl mx-auto space-y-6"
      dir="rtl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <Label className="text-sm md:text-base font-medium text-right" htmlFor="contact">
          البريد الالكتروني أو رقم الهاتف
        </Label>
        <div className="md:col-span-2">
          <Input
            className="w-full bg-gray-100 dark:bg-gray-800"
            {...register("phoneOrEmail")}
            id="contact"
            type="text"
            placeholder="رقم الهاتف أو البريد الالكتروني"
            required
          />
          {errors.phoneOrEmail && (
            <p className="mt-1 text-xs text-red-500">{errors.phoneOrEmail.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <Label className="text-sm md:text-base font-medium text-right" htmlFor="subject">
          نوع الخدمة
        </Label>
        <div className="md:col-span-2">
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={service ?? field.value} required>
                <SelectTrigger
                  className="w-full bg-gray-100 dark:bg-gray-800"
                  id="subject"
                  dir="auto"
                >
                  <SelectValue placeholder="اختر نوع الخدمة" />
                </SelectTrigger>
                <SelectContent dir="auto" className="select-none">
                  <SelectGroup>
                    <SelectLabel>اختر نوع الخدمة</SelectLabel>
                    {services.map(service => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <Label className="text-sm md:text-base font-medium text-right" htmlFor="message">
          الرسالة
        </Label>
        <div className="md:col-span-2">
          <Textarea
            {...register("message")}
            className="w-full min-h-[150px] max-h-[300px] bg-gray-100 dark:bg-gray-800"
            placeholder="اكتب رسالتك هنا"
            id="message"
            required
          />
          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-1" />
        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              "إرسال الرسالة"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

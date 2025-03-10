"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
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
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { calculatePasswordStrength } from "@/lib/calculate-password-strength"
import { signupSchema } from "@/schemas/signup"
import { api } from "@/trpc/react"

const newPasswordSchema = signupSchema
  .pick({ password: true })
  .extend({
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  })

type NewPasswordData = z.infer<typeof newPasswordSchema>

export default function NewPasswordForm({ token }: { token: string }) {
  const toast = useToast()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const resetPassword = api.auth.resetPassword.useMutation()

  const form = useForm<NewPasswordData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "", token },
  })

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "password") {
        setPasswordStrength(calculatePasswordStrength(value.password ?? ""))
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(data: NewPasswordData) {
    startTransition(async () => {
      try {
        const result = await resetPassword.mutateAsync({
          password: data.password,
          token: data.token,
        })

        if (result.success) {
          toast.success(result.message)
          setTimeout(() => redirect("/signin"), 2500)
        } else {
          toast.error(result.message)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "حدث خطأ غير متوقع"
        console.error("New Password Error:", JSON.stringify(error))
        toast.error(errorMsg ?? "حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة مرة أخرى.")
      }
    })
  }

  if (!token) return null

  return (
    <div className="container mx-auto max-w-md px-2.5 py-20">
      <div className="mb-14 flex flex-col">
        <h1 className="text-center text-2xl font-bold select-none">إنشاء كلمة مرور جديدة</h1>
        <small className="mt-2 text-center text-sm text-gray-600 select-none dark:text-gray-300">
          الرجاء اختيار كلمة مرور قوية لحسابك
        </small>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور الجديدة</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور الجديدة"
                        className="pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="تأكيد كلمة المرور الجديدة"
                        className="pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-4 w-4 text-gray-500" />
                      ) : (
                        <EyeIcon className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm text-gray-500 select-none">
              قوة كلمة المرور:
              <Progress value={passwordStrength} className="mt-2" />
            </div>
          </div>
          <Button disabled={isPending} type="submit" className="w-full cursor-pointer">
            {isPending ? "جاري إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

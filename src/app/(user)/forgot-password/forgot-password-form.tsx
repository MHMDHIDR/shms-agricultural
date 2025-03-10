"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { startTransition } from "react"
import { useForm } from "react-hook-form"
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
import { useToast } from "@/hooks/use-toast"
import { signupSchema } from "@/schemas/signup"
import { api } from "@/trpc/react"
import type { z } from "zod"

const resetPasswordSchema = signupSchema.pick({ email: true })

export type resetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function SignInForm() {
  const toast = useToast()
  const router = useRouter()

  const { mutateAsync: resetUserByEmail, isPending: isLoading } =
    api.auth.resetUserByEmail.useMutation()

  const form = useForm<resetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  })

  function onSubmit(data: resetPasswordFormValues) {
    startTransition(async () => {
      try {
        const resetSent = await resetUserByEmail(data)
        if (!resetSent.success) {
          toast.error(resetSent.message)
          return
        }

        toast.success(resetSent.message)
        router.replace("/")
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "حدث خطأ غير متوقع"
        console.error("Reset Password Error:", error)
        toast.error(errorMsg)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs select-none">البريد الالكتروني</FormLabel>
              <FormControl>
                <Input
                  placeholder="البريد الالكتروني"
                  type="email"
                  className="border border-gray-200 bg-gray-200 text-gray-700 focus:border-purple-500 focus:bg-white focus:outline-hidden dark:bg-gray-800 dark:text-gray-300"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant={"pressable"} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="animate-spin text-green-500" />}
          إستعادة كلمة المرور
        </Button>
      </form>
    </Form>
  )
}

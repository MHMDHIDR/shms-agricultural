"use server"

import { signIn } from "@/server/auth"
import { api } from "@/trpc/server"
import type { SignInFormValues } from "@/schemas/signin"

export async function signInAction(values: SignInFormValues) {
  try {
    const result = (await signIn("credentials", {
      redirect: false,
      emailOrPhone: values.emailOrPhone,
      password: values.password,
    })) as { error: string }

    if (!result) {
      return { error: "حدث خطأ غير متوقع!" }
    }

    if (result.error || result.error === "CredentialsSignin") {
      return { error: "Invalid credentials" }
    }

    const theme = await api.user.getUserThemeByCredentials({
      emailOrPhone: values.emailOrPhone,
    })

    return { success: true, theme }
  } catch (error) {
    console.error("Sign in error:", error)

    if (error instanceof Error && "type" in error) {
      const authError = error as Error & { type: string }
      switch (authError.type) {
        case "CredentialsSignin":
          return { error: "كلمة المرور غير صحيحة" }
        default:
          return { error: "حدث خطأ غير متوقع!" }
      }
    }

    throw error
  }
}

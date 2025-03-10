import { isValidPhoneNumber } from "libphonenumber-js"
import { z } from "zod"

export const signInSchema = z.object({
  emailOrPhone: z
    .string({ required_error: "البريد الالكتروني او رقم الهاتف مطلوب" })
    .min(1, "البريد الالكتروني او رقم الهاتف مطلوب")
    .refine(
      value => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        // If it's an email, validate as email
        if (emailRegex.test(value)) {
          return true
        }
        // For phone numbers, add + if not present before validation
        const phoneNumberToValidate = value.startsWith("+") ? value : `+${value}`
        return isValidPhoneNumber(phoneNumberToValidate)
      },
      { message: "الرجاء ادخال بريد الكتروني او رقم الهاتف صحيح" },
    ),
  password: z
    .string({ required_error: "كلمة المرور مطلوبة" })
    .min(1, "كلمة المرور مطلوبة")
    .min(5, "كلمة المرور يجب ان تكون اكثر من 5 حروف")
    .max(32, "كلمة المرور يجب ان تكون اقل من 32 حرف"),
})

export type SignInFormValues = z.infer<typeof signInSchema>

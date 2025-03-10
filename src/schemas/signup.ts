import { isValidPhoneNumber } from "libphonenumber-js"
import { z } from "zod"

export const signupSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون أكثر من حرفين"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phone: z.string().refine(
    value => {
      // For phone numbers, add + if not present before validation
      const phoneNumberToValidate = value.startsWith("+") ? value : `+${value}`
      return isValidPhoneNumber(phoneNumberToValidate)
    },
    {
      message: "رقم الهاتف غير صالح",
    },
  ),
  nationality: z.string().min(2, "الرجاء اختيار الجنسية"),
  dateOfBirth: z.date({
    required_error: "تاريخ الميلاد مطلوب",
    invalid_type_error: "تاريخ الميلاد غير صالح",
  }),
  address: z
    .string({ required_error: "يجب إدخال العنوان لنستطيع التواصل معك" })
    .min(2, "العنوان يجب أن يكون أكثر من حرفين"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون أكثر من 8 أحرف")
    .regex(/[A-Z]/, "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل")
    .regex(/[a-z]/, "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل")
    .regex(/[0-9]/, "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل")
    .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل مثل "!@#$%^&*"'),
  confirmPassword: z.string(),
  theme: z.enum(["light", "dark"]).default("light"),
  accountStatus: z.enum(["active", "block", "pending"]).optional().default("pending"),
  image: z.string().default(""),
  doc: z.string().default(""),
})

export const updatePublicSchema = z.object({
  id: z.string(),
  sn: z.number(),
  image: z.string().optional(),
  doc: z.string().optional(),
})

export type SignupInput = z.infer<typeof signupSchema>
export type UpdatePublicInput = z.infer<typeof updatePublicSchema>

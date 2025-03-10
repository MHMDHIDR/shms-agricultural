import { isValidPhoneNumber } from "libphonenumber-js"
import { z } from "zod"

export const accountFormSchema = z.object({
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
  nationality: z.string().min(2, "الجنسية يجب أن تكون أكثر من حرفين"),
  dateOfBirth: z.date({
    required_error: "تاريخ الميلاد مطلوب",
    invalid_type_error: "تاريخ الميلاد غير صالح",
  }),
  address: z
    .string({ required_error: "يجب إدخال العنوان لنستطيع التواصل معك" })
    .min(2, "العنوان يجب أن يكون أكثر من حرفين"),
  theme: z.enum(["light", "dark"], {
    required_error: "يجب اختيار وضع السمة",
  }),
  image: z.union([z.string().url("رابط الصورة غير صالح"), z.string().length(0)]).optional(),
  doc: z.union([z.string().url("رابط المستند غير صالح"), z.string().length(0)]).optional(),
})

export type AccountFormValues = z.infer<typeof accountFormSchema>

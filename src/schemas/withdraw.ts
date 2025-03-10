import { z } from "zod"

export const createWithdrawAmountSchema = (maxAmount = 1000000) =>
  z.object({
    amount: z
      .number()
      .min(1, "الرجاء إدخال مبلغ أكبر من صفر")
      .max(maxAmount, "المبلغ المطلوب كبير جداً"),
  })

export type WithdrawFormData = z.infer<ReturnType<typeof createWithdrawAmountSchema>>

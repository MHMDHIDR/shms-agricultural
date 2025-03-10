import { z } from "zod"

const SocialType = z.enum(["facebook", "x", "instagram", "youtube"])

export const socialLinksSchema = z.object({
  socialType: SocialType.describe("نوع السوشال مطلوب"),
  socialLink: z.string({ required_error: "رابط السوشال مطلوب" }).min(1, "يجب إدخال رابط السوشال"),
})

export type SocialLinksFormValues = z.infer<typeof socialLinksSchema>

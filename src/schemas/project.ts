import { z } from "zod"

// Base schema without required fields
const baseProjectSchema = z.object({
  projectName: z.string().min(3, "اسم المشروع يجب أن يكون 3 أحرف على الأقل"),
  projectLocation: z.string().min(3, "موقع المشروع يجب أن يكون 3 أحرف على الأقل"),
  projectStartDate: z.date({
    required_error: "تاريخ بداية المشروع مطلوب",
  }),
  projectEndDate: z.date({
    required_error: "تاريخ نهاية المشروع مطلوب",
  }),
  projectInvestDate: z.date({
    required_error: "تاريخ نهاية الاستثمار مطلوب",
  }),
  projectProfitsCollectDate: z.date({
    required_error: "تاريخ جمع الأرباح مطلوب",
  }),
  projectStatus: z.enum(["pending", "active"]),
  projectTotalStocks: z.number().min(1, "إجمالي عدد الأسهم يجب أن يكون أكبر من 0"),
  projectStockPrice: z.number().min(1, "سعر السهم يجب أن يكون أكبر من 0"),
  projectStockProfits: z.number().min(0, "أرباح السهم يجب أن تكون 0 أو أكبر"),
  projectDescription: z.string().min(10, "وصف المشروع يجب أن يكون 10 أحرف على الأقل"),
  projectTerms: z.string().min(10, "شروط المشروع يجب أن تكون 10 أحرف على الأقل"),
})

// Create schema with required files
export const projectSchema = baseProjectSchema.extend({
  projectImages: z.array(z.string()).min(1, "صور المشروع مطلوبة"),
  projectStudyCase: z.string().min(1, "دراسة الجدوى مطلوبة"),
})

// Update schema with optional files
export const updateProjectSchema = baseProjectSchema.extend({
  projectImages: z.array(z.string()).optional(),
  projectStudyCase: z.string().optional(),
  projectStudyCaseVisibility: z.boolean().optional(),
})

export type ProjectInput = z.infer<typeof projectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"

export const faqRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const [faqs, count] = await Promise.all([
      ctx.db.faq.findMany({ orderBy: { createdAt: "desc" } }),
      ctx.db.faq.count(),
    ])

    return { faqs, count }
  }),

  create: protectedProcedure
    .input(
      z.object({
        question: z.string().min(1, "السؤال مطلوب"),
        answer: z.string().min(1, "الإجابة مطلوبة"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.faq.create({
        data: {
          question: input.question,
          answer: input.answer,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        question: z.string().min(1, "السؤال مطلوب"),
        answer: z.string().min(1, "الإجابة مطلوبة"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.faq.update({
        where: { id: input.id },
        data: {
          question: input.question,
          answer: input.answer,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.faq.delete({ where: { id: input.id } })
    }),
})

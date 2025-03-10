import { AccountingOperationStatus } from "@prisma/client"
import { z } from "zod"
import { createWithdrawAmountSchema } from "@/schemas/withdraw"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const operationsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const [operations, count] = await Promise.all([
      ctx.db.withdraw_actions.findMany({
        include: {
          user: {
            select: {
              sn: true,
              name: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      ctx.db.withdraw_actions.count(),
    ])

    return { operations, count }
  }),

  getUserWithdrawOperations: protectedProcedure.query(async ({ ctx }) => {
    const operations = await ctx.db.withdraw_actions.findMany({
      where: {
        user_id: ctx.session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
            sn: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return operations
  }),

  createWithdrawRequest: protectedProcedure
    .input(createWithdrawAmountSchema(1000000))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { credits: true },
      })

      if (!user) {
        throw new Error("المستخدم غير موجود!")
      }

      if (user.credits === 0) {
        throw new Error("حسابك لا يحتوي على رصيد للسحب!")
      }

      if (input.amount > user.credits) {
        throw new Error("الرصيد المطلوب سحبه أكبر من الرصيد المتاح!")
      }

      const [withdrawAction] = await ctx.db.$transaction([
        // Create withdrawal action
        ctx.db.withdraw_actions.create({
          data: {
            withdraw_amount: input.amount,
            action_type: "withdraw",
            accounting_operation_status: "pending",
            user: { connect: { id: ctx.session.user.id } },
          },
        }),
        // deduct the amount from the user's credits if withdrawal action is successful
        ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { credits: { decrement: input.amount } },
        }),
      ])

      return withdrawAction
    }),

  updateOperationStatus: protectedProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        status: z.nativeEnum(AccountingOperationStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { ids, status } = input
      await ctx.db.withdraw_actions.updateMany({
        where: { id: { in: ids } },
        data: { accounting_operation_status: status },
      })
    }),

  bulkDelete: protectedProcedure
    .input(z.object({ operationIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { operationIds } = input
      await ctx.db.withdraw_actions.deleteMany({ where: { id: { in: operationIds } } })
    }),
})

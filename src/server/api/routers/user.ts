import { hash } from "bcryptjs"
import { z } from "zod"
import { extractS3FileName } from "@/lib/extract-s3-filename"
import { signupSchema, updatePublicSchema } from "@/schemas/signup"
import { createCaller } from "@/server/api/root"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"
import type { Prisma } from "@prisma/client"

const updateUserSchema = signupSchema.omit({ confirmPassword: true }).partial()

const getUserInfoSchema = z.object({
  select: z
    .object({
      name: z.boolean().optional(),
      email: z.boolean().optional(),
      phone: z.boolean().optional(),
      nationality: z.boolean().optional(),
      dateOfBirth: z.boolean().optional(),
      address: z.boolean().optional(),
      theme: z.boolean().optional(),
      accountStatus: z.boolean().optional(),
      image: z.boolean().optional(),
      doc: z.boolean().optional(),
      stocks: z.boolean().optional(),
      stockLimit: z.boolean().optional(),
      credits: z.boolean().optional(),
      role: z.boolean().optional(),
      isDeleted: z.boolean().optional(),
      createdAt: z.boolean().optional(),
      updatedAt: z.boolean().optional(),
    })
    .refine(obj => Object.keys(obj).length > 0, {
      message: "At least one property must be selected",
    }),
})

export const userRouter = createTRPCRouter({
  getUserThemeByCredentials: publicProcedure
    .input(z.object({ emailOrPhone: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          OR: [{ email: input.emailOrPhone }, { phone: input.emailOrPhone }],
        },
        select: { theme: true },
      })

      return user?.theme ?? "light"
    }),

  getUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({ where: { id: input.id } })
    }),

  getUserByEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({ where: { email: input.email } })
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const [users, count] = await Promise.all([ctx.db.user.findMany(), ctx.db.user.count()])

    return { users, count }
  }),

  getInvestors: publicProcedure.query(async ({ ctx }) => {
    const [investors, count] = await Promise.all([
      ctx.db.user.findMany({ where: { stocks: { some: {} } } }),
      ctx.db.user.count({ where: { stocks: { some: {} } } }),
    ])

    return { investors, count }
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), ...updateUserSchema.shape }))
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { id: input.id },
        select: { image: true, doc: true },
      })

      if (!existingUser) {
        throw new Error("User not found")
      }

      const caller = createCaller(ctx)
      if (input.image && input.image !== existingUser.image && existingUser.image) {
        const oldFileKey = extractS3FileName(existingUser.image)
        if (oldFileKey) {
          await caller.S3.deleteFile({ fileName: oldFileKey })
        }
      }

      // Handle document deletion
      if (input.doc && input.doc !== existingUser.doc && existingUser.doc) {
        const oldFileKey = extractS3FileName(existingUser.doc)
        if (oldFileKey) {
          await caller.S3.deleteFile({ fileName: oldFileKey })
        }
      }

      const data: Partial<Prisma.UserUpdateInput> = {}

      // Only include defined fields
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined && key !== "id") {
          data[key as keyof Prisma.UserUpdateInput] = value
        }
      })

      if (input.password) {
        data.password = await hash(input.password, 12)
      }

      return ctx.db.user.update({ where: { id: input.id }, data })
    }),

  updatePublic: publicProcedure.input(updatePublicSchema).mutation(async ({ ctx, input }) => {
    const updateData: Record<string, string | number> = {}

    if (input.image !== undefined) {
      updateData.image = input.image
    }
    if (input.doc !== undefined) {
      updateData.doc = input.doc
    }
    updateData.sn = input.sn

    return ctx.db.user.update({ where: { id: input.id }, data: updateData })
  }),

  /**
   * Deleting the user will just mark the user as deleted
   * and return the stocks to the projects
   * @param id - The id of the user to delete
   * @returns The updated user
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        select: { stocks: true },
      })

      // Return stocks to projects if any
      if (user?.stocks?.length) {
        for (const stock of user.stocks) {
          await ctx.db.projects.update({
            where: { id: stock.id },
            data: { projectAvailableStocks: { increment: stock.stocks }, updatedAt: new Date() },
          })
        }
      }

      await ctx.db.user.update({
        where: { id: input.id },
        data: { stocks: [], isDeleted: true, accountStatus: "block" },
      })
    }),

  getUserInfo: protectedProcedure.input(getUserInfoSchema).query(async ({ ctx, input }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: input.select,
    })
  }),

  depositForUsers: protectedProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
        projectId: z.string(),
        depositType: z.enum(["capital", "profits", "reset"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userIds, projectId, depositType } = input

      const project = await ctx.db.projects.findUnique({
        where: { id: projectId },
      })

      if (!project) {
        throw new Error("المشروع غير موجود")
      }

      const users = await ctx.db.user.findMany({
        where: {
          id: { in: userIds },
          stocks: {
            some: {
              id: projectId,
            },
          },
        },
      })

      let anyUpdatesPerformed = false

      if (depositType === "reset") {
        // Handle reset logic
        for (const user of users) {
          if (!user.stocks || user.stocks.length === 0) continue

          let updatedStocks = [...user.stocks]
          let creditsToUpdate = 0

          updatedStocks = updatedStocks.map(stock => {
            if (stock.id === projectId) {
              const baseStockValue = stock.stocks * project.projectStockPrice

              if (stock.capitalDeposited) {
                creditsToUpdate -= baseStockValue
              }

              if (stock.profitsDeposited) {
                const profitPercentage = stock.newPercentage || 0
                const stockProfits = project.projectStockProfits
                const additionalProfit = stockProfits * (profitPercentage / 100)
                const totalStockProfit = (stockProfits + additionalProfit) * stock.stocks
                creditsToUpdate -= totalStockProfit
              }

              anyUpdatesPerformed = true
              return {
                ...stock,
                capitalDeposited: false,
                profitsDeposited: false,
              }
            }
            return stock
          })

          if (creditsToUpdate !== 0) {
            await ctx.db.user.update({
              where: { id: user.id },
              data: {
                credits: { decrement: Math.abs(creditsToUpdate) },
                stocks: updatedStocks,
              },
            })
          }
        }
      } else {
        // Handle capital and profits deposits
        for (const user of users) {
          if (!user.stocks) continue

          let totalCredits = 0
          const updatedStocks: typeof user.stocks = []

          // Iterate through user's stocks
          for (const stock of user.stocks) {
            if (stock.id === projectId) {
              // Only process stocks for this specific project
              const stockCredits = stock.stocks * project.projectStockPrice

              // Skip already deposited stocks based on depositType
              if (depositType === "capital" && stock.capitalDeposited) {
                updatedStocks.push(stock) // Keep the stock unchanged
                continue
              }

              if (depositType === "profits" && stock.profitsDeposited) {
                updatedStocks.push(stock) // Keep the stock unchanged
                continue
              }

              if (depositType === "capital" && !stock.capitalDeposited) {
                totalCredits += stockCredits
                updatedStocks.push({ ...stock, capitalDeposited: true })
                anyUpdatesPerformed = true
              }

              if (depositType === "profits" && !stock.profitsDeposited) {
                // Calculate profits percentage
                const profitPercentage = stock.newPercentage || 0
                const stockProfits = project.projectStockProfits

                // Calculate additional profit based on percentage
                const additionalProfit = stockProfits * (profitPercentage / 100)

                // Total profit for this stock
                const totalStockProfit = stockProfits + additionalProfit

                if (stock.capitalDeposited) {
                  // If capital was already deposited, only add profits
                  totalCredits += totalStockProfit * stock.stocks
                } else {
                  // If capital wasn't deposited yet, add both capital and profits
                  totalCredits += totalStockProfit * stock.stocks + stockCredits
                }

                updatedStocks.push({
                  ...stock,
                  capitalDeposited: true,
                  profitsDeposited: true,
                })
                anyUpdatesPerformed = true
              }
            } else {
              // Keep other projects' stocks unchanged
              updatedStocks.push(stock)
            }
          }

          // Update user credits only if there are changes
          if (totalCredits > 0) {
            await ctx.db.user.update({
              where: { id: user.id },
              data: {
                credits: { increment: totalCredits },
                stocks: updatedStocks,
              },
            })
          }
        }
      }

      if (!anyUpdatesPerformed) {
        return {
          success: false,
          message:
            depositType === "capital"
              ? "تم إيداع رأس المال لجميع الأسهم في هذا المشروع مسبقاً"
              : depositType === "profits"
                ? "تم إيداع الأرباح لجميع الأسهم في هذا المشروع مسبقاً"
                : "لا يوجد رصيد لإعادة تعيينه",
        }
      }

      return {
        success: true,
        message:
          depositType === "capital"
            ? "تم إيداع رأس المال للمستخدمين المحددين"
            : depositType === "profits"
              ? "تم إيداع الأرباح للمستخدمين المحددين"
              : "تم إعادة تعيين الرصيد للمستخدمين المحددين",
      }
    }),

  bulkUpdateUsers: protectedProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
        actionType: z.enum(["delete", "block", "unblock"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userIds, actionType } = input

      switch (actionType) {
        case "delete": {
          // Get all users with their stocks
          const users = await ctx.db.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, stocks: true },
          })

          // Return stocks to projects for each user
          for (const user of users) {
            if (user.stocks?.length) {
              for (const stock of user.stocks) {
                await ctx.db.projects.update({
                  where: { id: stock.id },
                  data: {
                    projectAvailableStocks: { increment: stock.stocks },
                    updatedAt: new Date(),
                  },
                })
              }
            }

            // Mark user as deleted and remove their stocks
            await ctx.db.user.update({
              where: { id: user.id },
              data: { stocks: [], isDeleted: true, accountStatus: "block" },
            })
          }

          return {
            success: true,
            message: "تم حذف المستخدمين المحددين بنجاح",
          }
        }

        case "block": {
          await ctx.db.user.updateMany({
            where: { id: { in: userIds } },
            data: { accountStatus: "block" },
          })

          return {
            success: true,
            message: "تم حظر المستخدمين المحددين بنجاح",
          }
        }

        case "unblock": {
          await ctx.db.user.updateMany({
            where: { id: { in: userIds } },
            data: { accountStatus: "active" },
          })

          return {
            success: true,
            message: "تم إلغاء حظر المستخدمين المحددين بنجاح",
          }
        }
      }
    }),

  getActiveSessions: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date()
    const sessions = await ctx.db.session.findMany({
      where: {
        expires: {
          gt: now,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        expires: "desc",
      },
    })
    return sessions
  }),
})

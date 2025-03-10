import { ObjectId } from "mongodb"
import { z } from "zod"
import { calculateNewAvailableStocks } from "@/lib/calculate-new-available-stocks"
import { sendPurchaseConfirmationEmail } from "@/lib/email/purchase-confirmation"
import { extractS3FileName } from "@/lib/extract-s3-filename"
import { projectSchema, updateProjectSchema } from "@/schemas/project"
import { createCaller } from "@/server/api/root"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"

export const projectRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const session = ctx.session
    const role = session?.user?.role

    const [projects, count] = await Promise.all([
      ctx.db.projects.findMany(),
      ctx.db.projects.count(),
    ])

    return { projects, count, role }
  }),

  getProjectById: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.projects.findUnique({ where: { id: input.projectId } })
    }),

  updateProfitsPercentage: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        percentage: z.number().min(0).max(100),
        percentageCode: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.projects.update({
        where: { id: input.projectId },
        data: {
          projectSpecialPercentage: input.percentage,
          projectSpecialPercentageCode: input.percentageCode,
          updatedAt: new Date(),
        },
      })

      return project
    }),

  deleteProfitsPercentage: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.projects.update({
        where: { id: input.projectId },
        data: {
          projectSpecialPercentage: null,
          projectSpecialPercentageCode: null,
          updatedAt: new Date(),
        },
      })

      return project
    }),

  validatePercentageCode: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.projects.findUnique({
        where: { id: input.projectId },
        select: {
          projectSpecialPercentageCode: true,
          projectSpecialPercentage: true,
        },
      })

      if (project?.projectSpecialPercentageCode === input.code) {
        return { percentage: project.projectSpecialPercentage ?? 0 }
      }

      throw new Error("رمز غير صالح")
    }),

  confirmPurchase: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        stocks: z.number().min(1),
        percentageCode: z.string().optional(),
        newPercentage: z.number(),
        totalPayment: z.number(),
        totalProfit: z.number(),
        totalReturn: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, stocks, percentageCode, newPercentage } = input
      const userId = ctx.session?.user?.id

      if (!userId) {
        throw new Error("User not authenticated")
      }

      // Start transaction with longer timeout
      const result = await ctx.db.$transaction(
        async tx => {
          // Get project and user
          const [project, user] = await Promise.all([
            tx.projects.findUnique({ where: { id: projectId } }),
            tx.user.findUnique({ where: { id: userId } }),
          ])

          if (!project || !user) {
            throw new Error("Project or user not found")
          }

          if (project.projectAvailableStocks < stocks) {
            throw new Error("Not enough stocks available")
          }

          // Update project available stocks
          await tx.projects.update({
            where: { id: projectId },
            data: {
              projectAvailableStocks: {
                decrement: stocks,
              },
              updatedAt: new Date(),
            },
          })

          // Add stocks to user
          const newStock = {
            id: new ObjectId(projectId).toString(),
            stocks,
            newPercentage,
            percentageCode: percentageCode ?? "",
            createdAt: new Date(),
            capitalDeposited: false,
            profitsDeposited: false,
          }

          await tx.user.update({
            where: { id: userId },
            data: {
              stocks: { push: newStock },
            },
          })

          return { project, user }
        },
        {
          timeout: 10000, // 10 seconds
          maxWait: 5000, // 5 seconds max wait for lock
        },
      )

      // Send email after transaction completes
      try {
        await sendPurchaseConfirmationEmail({
          user: result.user,
          project: result.project,
          purchaseDetails: {
            ...input,
            createdAt: new Date(),
          },
        })
      } catch (error) {
        // Log email error but don't fail the transaction
        console.error("Failed to send confirmation email:", error)
      }

      return { success: true }
    }),

  create: protectedProcedure
    .input(projectSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.projectImages.length || !input.projectStudyCase) {
        throw new Error("صور المشروع ودراسة الجدوى مطلوبة")
      }

      const project = await ctx.db.projects.create({
        data: {
          ...input,
          projectAvailableStocks: input.projectTotalStocks,
          projectImages: input.projectImages.map(url => ({
            imgDisplayName: url.split("/").pop() ?? "",
            imgDisplayPath: url,
          })),
          projectStudyCase: [
            {
              imgDisplayName: input.projectStudyCase.split("/").pop() ?? "",
              imgDisplayPath: input.projectStudyCase,
            },
          ],
        },
      })

      return project.id
    }),

  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const caller = createCaller(ctx)

      // remove project images and study case from s3
      const project = await ctx.db.projects.findUnique({ where: { id: input.id } })
      if (project) {
        // Delete project images
        if (project.projectImages) {
          for (const image of project.projectImages) {
            const oldFileKey = extractS3FileName(image.imgDisplayPath)
            if (oldFileKey) {
              await caller.S3.deleteFile({ fileName: oldFileKey })
            }
          }
        }
        // Delete study case
        if (project.projectStudyCase) {
          for (const study of project.projectStudyCase) {
            const oldFileKey = extractS3FileName(study.imgDisplayPath)
            if (oldFileKey) {
              await caller.S3.deleteFile({ fileName: oldFileKey })
            }
          }
        }
      }

      await ctx.db.projects.delete({ where: { id: input.id } })
      return { success: true }
    }),

  deleteManyById: protectedProcedure
    .input(z.object({ projectIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const caller = createCaller(ctx)

      // Remove all projects' files from S3 and delete projects
      const projects = await ctx.db.projects.findMany({
        where: { id: { in: input.projectIds } },
      })

      for (const project of projects) {
        // Delete project images
        if (project.projectImages) {
          for (const image of project.projectImages) {
            const oldFileKey = extractS3FileName(image.imgDisplayPath)
            if (oldFileKey) {
              await caller.S3.deleteFile({ fileName: oldFileKey })
            }
          }
        }
        // Delete study case
        if (project.projectStudyCase) {
          for (const study of project.projectStudyCase) {
            const oldFileKey = extractS3FileName(study.imgDisplayPath)
            if (oldFileKey) {
              await caller.S3.deleteFile({ fileName: oldFileKey })
            }
          }
        }
      }

      await ctx.db.projects.deleteMany({
        where: { id: { in: input.projectIds } },
      })

      return { success: true }
    }),

  update: protectedProcedure
    .input(updateProjectSchema.partial().extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      // If projectTotalStocks is being updated, adjust available stocks
      if (input.projectTotalStocks) {
        const currentProject = await ctx.db.projects.findUnique({
          where: { id },
          select: {
            projectTotalStocks: true,
            projectAvailableStocks: true,
          },
        })

        if (currentProject) {
          const newAvailableStocks = calculateNewAvailableStocks(
            currentProject.projectTotalStocks,
            input.projectTotalStocks,
            currentProject.projectAvailableStocks,
          )

          await ctx.db.projects.update({
            where: { id },
            data: {
              projectAvailableStocks: newAvailableStocks,
              updatedAt: new Date(),
            },
          })
        }
      }

      const project = await ctx.db.projects.update({
        where: { id },
        data: {
          ...data,
          projectImages: data.projectImages?.map(url => ({
            imgDisplayName: url.split("/").pop() ?? "",
            imgDisplayPath: url,
          })),
          projectStudyCase: data.projectStudyCase
            ? [
                {
                  imgDisplayName: data.projectStudyCase.split("/").pop() ?? "",
                  imgDisplayPath: data.projectStudyCase,
                },
              ]
            : undefined,
          updatedAt: new Date(),
        },
      })

      return project
    }),

  deleteProjectFile: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        fileUrl: z.string(),
        fileType: z.enum(["image", "studyCase"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const caller = createCaller(ctx)
      const fileKey = extractS3FileName(input.fileUrl)

      if (!fileKey) {
        throw new Error("Invalid file URL")
      }

      // Delete file from S3
      await caller.S3.deleteFile({ fileName: fileKey })

      // Update project record based on file type
      if (input.fileType === "image") {
        await ctx.db.projects.update({
          where: { id: input.projectId },
          data: {
            projectImages: {
              deleteMany: {
                where: { imgDisplayPath: input.fileUrl },
              },
            },
            updatedAt: new Date(),
          },
        })
      } else {
        await ctx.db.projects.update({
          where: { id: input.projectId },
          data: {
            projectStudyCase: {
              deleteMany: {
                where: { imgDisplayPath: input.fileUrl },
              },
            },
            updatedAt: new Date(),
          },
        })
      }

      return { success: true }
    }),

  deposit: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        depositType: z.enum(["capital", "profits", "reset"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectId, depositType } = input

      if (depositType === "reset") {
        // Keep existing reset logic
        const project = await ctx.db.projects.findUnique({ where: { id: projectId } })

        if (!project) {
          throw new Error("المشروع غير موجود")
        }

        const users = await ctx.db.user.findMany({
          where: {
            stocks: {
              some: { id: projectId },
            },
          },
        })

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

        return {
          success: true,
          message: "تم إعادة تعيين الرصيد للمشروع المحدد",
        }
      } else {
        const project = await ctx.db.projects.findUnique({
          where: { id: projectId },
        })

        if (!project) {
          throw new Error("المشروع غير موجود")
        }

        const users = await ctx.db.user.findMany({
          where: {
            stocks: {
              some: {
                id: projectId,
              },
            },
          },
        })

        let anyUpdatesPerformed = false

        // Iterate through each user
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

        // If no updates were performed, it means all stocks were already deposited
        if (!anyUpdatesPerformed) {
          throw new Error(
            depositType === "capital"
              ? "تم إيداع رأس المال لجميع الأسهم في هذا المشروع مسبقاً"
              : "تم إيداع الأرباح لجميع الأسهم في هذا المشروع مسبقاً",
          )
        }

        return {
          success: true,
          message:
            depositType === "capital"
              ? "تم إيداع رأس المال للمشروع المحدد"
              : "تم إيداع الأرباح للمشروع المحدد",
        }
      }
    }),

  sendPurchaseContract: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        stocks: z.number().min(1),
        newPercentage: z.number(),
        totalPayment: z.number(),
        totalProfit: z.number(),
        totalReturn: z.number(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user?.id

      if (!userId) {
        throw new Error("User not authenticated")
      }

      const [project, user] = await Promise.all([
        ctx.db.projects.findUnique({ where: { id: input.projectId } }),
        ctx.db.user.findUnique({ where: { id: userId } }),
      ])

      if (!project || !user) {
        throw new Error("Project or user not found")
      }

      try {
        await sendPurchaseConfirmationEmail({
          user,
          project,
          purchaseDetails: input,
        })

        return { success: true }
      } catch (error) {
        console.error("Failed to send contract email:", error)
        throw new Error("Failed to send contract email")
      }
    }),

  bulkUpdateProjects: protectedProcedure
    .input(
      z.object({
        projectIds: z.array(z.string()),
        actionType: z.enum(["pending", "active"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { projectIds, actionType } = input

      await ctx.db.projects.updateMany({
        where: { id: { in: projectIds } },
        data: { projectStatus: actionType },
      })

      return {
        success: true,
        message:
          actionType === "active"
            ? "تم تفعيل المشاريع المحددة بنجاح"
            : "تم تعطيل المشاريع المحددة بنجاح",
      }
    }),
})

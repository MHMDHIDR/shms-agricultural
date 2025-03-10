import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { socialLinksSchema } from "@/schemas/social-links"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"

export const socialLinksRouter = createTRPCRouter({
  getSocialLinks: publicProcedure.query(async ({ ctx }) => {
    const socialLinks = await ctx.db.socialLinks.findMany()

    return socialLinks
  }),

  insertSocialLinks: protectedProcedure
    .input(socialLinksSchema)
    .mutation(async ({ ctx, input }) => {
      const { socialType, socialLink } = input

      // Check if a link for this type already exists
      const existingLink = await ctx.db.socialLinks.findFirst({
        where: { socialType },
      })

      if (existingLink) {
        // Update existing link
        const updatedLink = await ctx.db.socialLinks.update({
          where: { id: existingLink.id },
          data: { socialLink },
        })

        return updatedLink
      }

      // Else create new link
      await ctx.db.socialLinks.create({
        data: { socialType, socialLink },
      })
    }),

  updateSocialLinks: protectedProcedure
    .input(socialLinksSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { socialType, socialLink, id } = input

      await ctx.db.socialLinks.update({
        where: { id },
        data: { socialType, socialLink },
      })
    }),

  deleteSocialLinks: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = input
        await ctx.db.socialLinks.delete({
          where: { id },
        })
      } catch (error) {
        if (error instanceof TRPCError) throw error

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "فشل حذف الرابط",
        })
      }
    }),
})

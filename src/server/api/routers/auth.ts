import { Prisma } from "@prisma/client"
import { TRPCError } from "@trpc/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { env } from "@/env"
import { ADMIN_EMAIL, APP_TITLE } from "@/lib/constants"
import { sendEmail } from "@/lib/email"
import { sendPasswordResetEmail } from "@/lib/email/reset-password"
import { signupSchema } from "@/schemas/signup"
import { createCaller } from "@/server/api/root"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc"

export const authRouter = createTRPCRouter({
  getUserById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({ where: { id: input.id } })
    }),

  create: publicProcedure.input(signupSchema).mutation(async ({ ctx, input }) => {
    const hashedPassword = await hash(input.password, 12)

    return ctx.db.$transaction(async tx => {
      try {
        const user = await tx.user.create({
          data: {
            name: input.name,
            email: input.email,
            phone: input.phone,
            nationality: input.nationality,
            dateOfBirth: input.dateOfBirth,
            image: input.image,
            doc: input.doc,
            address: input.address,
            password: hashedPassword,
          },
        })

        return user.id
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          throw new Error("البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل")
        }
        throw new Error("حدث خطأ أثناء تسجيل الحساب، يرجى المحاولة مرة أخرى")
      }
    })
  }),

  generatePasswordResetToken: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const token = crypto.randomUUID() // OR you can use ==> bcrypt.hashSync(email, 10)
      const oneHour = 3600 * 1000
      const expires = new Date(new Date().getTime() + oneHour)

      const existingToken = await ctx.db.user.findFirst({
        where: { email: input.email },
      })

      if (existingToken?.resetToken) {
        await ctx.db.user.update({
          where: { id: existingToken.id },
          data: { resetToken: null, resetTokenExpires: null },
        })
      }

      // add new token
      const user = await ctx.db.user.update({
        where: { email: input.email },
        data: { resetToken: token, resetTokenExpires: expires },
      })

      if (!user.resetToken || !user.resetTokenExpires) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "حدث خطأ أثناء إعادة تعيين كلمة المرور، يرجى المحاولة مرة أخرى",
        })
      }

      return { token: user.resetToken, expiresIn: oneHour }
    }),

  resetUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const caller = createCaller(ctx)
      const user = await ctx.db.user.findUnique({
        where: { email: input.email.trim().toLowerCase() },
      })
      const successMsg = "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني 🎉"

      if (!user) {
        // throw new TRPCError({ code: "NOT_FOUND",  message: "البريد الإلكتروني غير موجود!" });
        // its better so show a message of success rather than failure, bcuz if it was someone else's email, they will know that the email is registered
        return { success: true, message: successMsg }
      }

      const passwordResetToken = await caller.auth.generatePasswordResetToken({
        email: input.email,
      })

      const passwordResetTokenSentEmail = await sendPasswordResetEmail({
        username: user.name,
        email: user.email,
        token: passwordResetToken,
      })
      const result = passwordResetTokenSentEmail.data?.id

      return {
        success: !!result, // by using !! we mean if result is not null or undefined
        message: result ? successMsg : "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور",
      }
    }),

  resetPassword: publicProcedure
    .input(z.object({ token: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findFirst({
          where: {
            resetToken: input.token,
            resetTokenExpires: { gt: new Date() },
          },
        })

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "رمز إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية، يرجى طلب رابط جديد",
          })
        }

        const hashedPassword = await hash(input.password, 12)

        await ctx.db.user.update({
          where: { id: user.id },
          data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpires: null,
          },
        })

        await sendEmail({
          to: user.email,
          subject: `تم تغيير كلمة المرور الخاصة بحسابك في منصة ${APP_TITLE}`,
          html: `
           <div style={{ direction: "rtl" }}>
            <h1>تم تغيير كلمة المرور الخاصة بحسابك</h1>

            <p>مرحباً ${user.name}, نود أعلامك أنه تم</p>

            <p>تم تغيير كلمة المرور الخاصة بحسابك بنجاح.</p>
            <p>يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة:</p>

            <a href="${env.NEXT_PUBLIC_APP_URL}/signin">
              <strong>تسجيل الدخول</strong>
            </a>

            <br /><hr />

            <p>إذا لم تقم بإجراء هذا التغيير، يرجى التواصل معنا فوراً على البريد الإلكتروني:</p>
            <strong>${ADMIN_EMAIL}</strong>

            <p>مع تحيات فريق ${APP_TITLE}</p>
           </div>
          `,
        })

        return {
          success: true,
          message: "تم تغيير كلمة المرور بنجاح",
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "حدث خطأ أثناء تغيير كلمة المرور",
        })
      }
    }),
})

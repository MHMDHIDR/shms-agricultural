import { randomBytes } from "crypto"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import Credentials from "next-auth/providers/credentials"
import { cookies } from "next/headers"
import { getBlurPlaceholder } from "@/lib/optimize-image"
import { signInSchema } from "@/schemas/signin"
import { db } from "@/server/db"
import type { AdapterSession, AdapterUser } from "@auth/core/adapters"
import type { User as UserTable, UserTheme } from "@prisma/client"
import type { NextAuthConfig, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

/* eslint-disable no-unused-vars */
declare module "next-auth" {
  interface User {
    role: UserTable["role"]
    theme: UserTheme
    blurImageDataURL: string | null
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string
    role: UserTable["role"]
    theme: UserTheme
    sessionToken?: string | null
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: UserTable["role"]
    theme: UserTheme
    blurImageDataURL: string | null
  }
}
/* eslint-enable no-unused-vars */

export const authConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        emailOrPhone: { label: "Email or Phone" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const { emailOrPhone, password } = await signInSchema.parseAsync(credentials)

          if (!emailOrPhone || !password) {
            return null
          }

          const user = await db.user.findFirst({
            where: {
              AND: [
                { OR: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
                { isDeleted: false },
              ],
            },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              password: true,
              theme: true,
              role: true,
              accountStatus: true,
            },
          })

          if (!user) {
            return null
          }

          if (user.accountStatus !== "active") {
            throw new Error("Account is not active")
          }

          const isValidPassword = await compare(password, user.password)
          if (!isValidPassword) {
            return null
          }

          let blurImage: string | null = null
          if (user.image) {
            blurImage = await getBlurPlaceholder({ imageSrc: user.image })
          }

          const cookieStore = await cookies()
          cookieStore.set("theme", user.theme)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            theme: user.theme,
            role: user.role,
            blurImageDataURL: blurImage,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: { signIn: "/signin" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT
      user: User | (AdapterUser & { sessionToken?: string })
      trigger?: "signIn" | "update" | "signUp"
      session?: Session
    }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user }
      }

      if (user) {
        token.id = user.id
        token.role = user.role
        token.theme = user.theme
        token.name = user.name
        token.image = user.image

        // Ensure sessionToken is copied to the token
        if ("sessionToken" in user) {
          token.sessionToken = user.sessionToken
        }
      }
      return token
    },
    async session({ session, token }) {
      const blurImage = session.user?.image
        ? await getBlurPlaceholder({ imageSrc: session.user.image })
        : null

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as UserTable["role"],
          theme: token.theme as UserTheme,
          name: token.name,
          image: token.image as string | null,
          blurImageDataURL: blurImage,
        },
      }
    },
  },
  events: {
    async signIn({ user, account }) {
      if (user.id && account?.providerAccountId) {
        const SESSION_EXPIRATION_DAYS = 24 * 60 * 60 * 1000 * 30
        const sessionToken = randomBytes(32).toString("hex")

        // Create the session and store it
        await db.session.create({
          data: {
            userId: user.id,
            sessionToken,
            expires: new Date(Date.now() + SESSION_EXPIRATION_DAYS),
          },
        })

        // Add sessionToken directly to the user object
        Object.assign(user, { sessionToken })
      }
    },
    async signOut(
      message: { session: void | AdapterSession | null | undefined } | { token: JWT | null },
    ) {
      const token = "token" in message ? message.token : null

      // If we don't have the session token in the JWT, try to find it
      if (token?.id) {
        const session = await db.session.findFirst({
          where: { userId: token.id },
          orderBy: { createdAt: "desc" },
        })

        if (session) {
          await db.session.delete({
            where: { sessionToken: session.sessionToken },
          })
        }
      }
    },
  },
} satisfies NextAuthConfig

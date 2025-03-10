import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc"
import { authRouter } from "./routers/auth"
import { contactRouter } from "./routers/contact"
import { faqRouter } from "./routers/faq"
import { operationsRouter } from "./routers/operations"
import { projectRouter } from "./routers/projects"
import { S3Router } from "./routers/s3"
import { socialLinksRouter } from "./routers/social-links"
import { userRouter } from "./routers/user"

export const appRouter = createTRPCRouter({
  user: userRouter,
  auth: authRouter,
  contact: contactRouter,
  projects: projectRouter,
  socialLinks: socialLinksRouter,
  faq: faqRouter,
  operations: operationsRouter,
  S3: S3Router,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)

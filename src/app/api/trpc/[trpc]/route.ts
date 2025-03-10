import * as Sentry from "@sentry/nextjs"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { type NextRequest } from "next/server"
import { appRouter } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  })
}

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError: ({ path, error }) => {
      // Always log the error
      console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`)

      // Capture with Sentry in all environments, but don't capture UNAUTHORIZED errors
      if (error.code !== "UNAUTHORIZED") {
        Sentry.captureException(error, {
          extra: { path },
          tags: { trpc_path: path },
        })
      }
    },
  })

export { handler as GET, handler as POST }

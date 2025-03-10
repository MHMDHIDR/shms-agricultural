import { env } from "@/env"
import { api } from "@/trpc/server"

export const baseUrl = env.NEXT_PUBLIC_APP_URL

export default async function sitemap() {
  const { projects } = await api.projects.getAll()
  const projectsSitemap = projects.map(project => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: project.updatedAt,
  }))

  const routes = [
    "",
    "/projects",
    "/about",
    "/contact",
    "/faqs",
    "/privacy",
    "/terms",
    "/cookies-policy",
    "/preparation",
    "/harvest",
    "/farming",
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }))

  return [...routes, ...projectsSitemap]
}

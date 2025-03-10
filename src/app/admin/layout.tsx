import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { auth } from "@/server/auth"
import { api } from "@/trpc/server"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) notFound()

  const { projects } = await api.projects.getAll()

  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar:state")?.value
  const initialSidebarOpen = sidebarState === "true"

  return (
    <SidebarProvider defaultOpen={initialSidebarOpen}>
      <AppSidebar projects={projects} user={session.user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,_height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <label
            className="flex w-full cursor-pointer items-center gap-2 px-4"
            htmlFor="sidebar-trigger"
            aria-label="فتح القائمة"
          >
            <SidebarTrigger className="mr-2" id="sidebar-trigger" />
            <span className="text-sm font-medium">فتح القائمة</span>
          </label>
        </header>
        <section className="mx-auto max-w-xs min-w-full sm:max-w-screen-sm xl:max-w-screen-xl">
          {children}
        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}

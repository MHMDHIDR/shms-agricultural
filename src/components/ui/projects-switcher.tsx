"use client"

import { ChevronsUpDown, Plus } from "lucide-react"
import Image from "next/image"
import * as React from "react"
import {
  DropdownLinkItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { APP_LOGO_SVG, APP_TITLE } from "@/lib/constants"

export function ProjectsSwitcher({
  projects,
}: {
  projects: {
    name: string
    logo: React.ElementType
    plan: string
    id: string
  }[]
}) {
  const { isMobile, open } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <strong className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-lg">
                {open ? (
                  <>
                    المشاريع الزراعية
                    <ChevronsUpDown size={14} className="mr-4" />
                  </>
                ) : (
                  <Image alt={APP_TITLE} src={APP_LOGO_SVG} width={36} height={36} />
                )}
              </strong>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            {projects.map(project => (
              <DropdownLinkItem
                key={project.name}
                className="gap-3 p-2 text-right rtl"
                href={`/admin/projects/${project.id}`}
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <project.logo className="size-4 shrink-0" />
                </div>
                {project.name}
              </DropdownLinkItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" dir="auto">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <DropdownLinkItem
                className="text-muted-foreground font-medium"
                href={"/admin/projects/new"}
              >
                أضف مشروع
              </DropdownLinkItem>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

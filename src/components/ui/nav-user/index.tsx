"use client"

import { ChevronsUpDown, LogOut, User as UserIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownLinkItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { APP_LOGO_SVG, APP_TITLE } from "@/lib/constants"
import { fallbackUsername } from "@/lib/fallback-username"
import { handleSignout } from "./actions"
import type { Session } from "next-auth"

export function NavUser({ user }: { user: Session["user"] }) {
  const { isMobile } = useSidebar()

  if (!user) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg cursor-pointer">
                <AvatarImage
                  src={user.image ?? APP_LOGO_SVG}
                  alt={user.name ?? APP_TITLE}
                  className="object-top"
                  blurDataURL={user?.blurImageDataURL ?? APP_LOGO_SVG}
                />
                <AvatarFallback className="rounded-lg">
                  {fallbackUsername(user.name ?? APP_TITLE)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-right text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="rtl w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="start"
            sideOffset={3}
          >
            <DropdownLinkItem href="/account">
              <UserIcon className="text-blue-400 w-4 h-4" />
              الحســاب
            </DropdownLinkItem>
            <DropdownMenuItem onClick={handleSignout}>
              <LogOut className="text-red-400 w-4 h-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

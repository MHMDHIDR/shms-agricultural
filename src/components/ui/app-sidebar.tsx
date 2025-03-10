"use client"

import {
  ChartArea,
  DollarSignIcon,
  Eye,
  HandCoins,
  HelpCircle,
  Home,
  Landmark,
  Link2Icon,
  PercentIcon,
  Plus,
  Settings2,
  Tractor,
  Users,
} from "lucide-react"
import * as React from "react"
import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"
import { ProjectsSwitcher } from "@/components/ui/projects-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import type { Projects } from "@prisma/client"
import type { Session } from "next-auth"

export function AppSidebar({
  projects,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  projects: Projects[]
  user: Session["user"]
}) {
  const { open, isMobile } = useSidebar()

  if (!user) return null

  const navItems = {
    user: {
      name: user?.name,
      email: user?.email,
      avatar: user?.name,
    },
    projects: projects.map(project => ({
      name: project.projectName,
      logo: Tractor,
      plan: "Enterprise",
      id: project.id,
    })),
    navMain: [
      {
        title: "لوحة الإدارة",
        url: "/admin",
        icon: Home,
      },
      {
        title: "المشاريع",
        url: open || isMobile ? "" : "/admin/projects",
        icon: Tractor,
        isActive: true, // will make the dropdown open by default
        items: [
          {
            title: "عرض المشاريع",
            url: "/admin/projects",
            icon: Eye,
          },
          {
            title: "أضف مشروع جديد",
            url: "/admin/projects/new",
            icon: Plus,
          },
        ],
      },
      {
        title: "العمليات المالية",
        url: open || isMobile ? "" : "/admin/operations",
        icon: DollarSignIcon,
        items: [
          {
            title: "المستثمرين",
            url: "/admin/investors",
            icon: HandCoins,
          },
          {
            title: "عرض العمليات",
            url: "/admin/operations",
            icon: Landmark,
          },
        ],
      },
      {
        title: "إعدادات",
        url: open || isMobile ? "" : "/admin/social-links",
        icon: Settings2,
        items: [
          {
            title: "صفحات التواصل الاجتماعي",
            url: "/admin/social-links",
            icon: Link2Icon,
          },
          {
            title: "الأسئلة الشائعة",
            url: "/admin/faq",
            icon: HelpCircle,
          },
        ],
      },
      {
        title: "المستخدمين",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "نسب الأرباح",
        url: "/admin/profits-percentage",
        icon: PercentIcon,
      },
      {
        title: "إحصائيات الزوار",
        url: "https://analytics.technodevlabs.com/share/OVylyVg7zfHirXjt/www.shmsagricultural.com",
        icon: ChartArea,
      },
    ],
  }

  return (
    <Sidebar side="right" collapsible="icon" className="bg-background" {...props}>
      <SidebarHeader className="pt-20">
        <ProjectsSwitcher projects={navItems.projects} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

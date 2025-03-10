"use client"

import clsx from "clsx"
import { LayoutDashboard, MenuIcon, Settings, User2 } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ShmsIcon } from "@/components/custom/icons"
import { AvatarFallback, AvatarImage, Avatar as AvatarWrapper } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownLinkItem,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { handleSignout } from "@/components/ui/nav-user/actions"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { APP_LOGO_SVG, APP_TITLE } from "@/lib/constants"
import { fallbackUsername, truncateUsername } from "@/lib/fallback-username"
import { cn } from "@/lib/utils"
import type { Session } from "next-auth"

export function Nav({ user }: { user: Session["user"] | undefined }) {
  const { data: session } = useSession()
  const currentUser = session?.user ?? user
  const [isSigningOut, setIsSigningOut] = useState(false)

  const [scrolled, setScrolled] = useState(false)
  const SCROLL_THRESHOLD = 150

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > SCROLL_THRESHOLD
      setScrolled(isScrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    {
      title: "المشاريع الاستثمارية",
      href: "/projects",
    },
    {
      title: "تحضير",
      href: "/preparation",
    },
    {
      title: "زراعة",
      href: "/farming",
    },
    {
      title: "حصاد",
      href: "/harvest",
    },
  ]

  const handleSignoutClick = async () => {
    setIsSigningOut(true)
    await handleSignout()
  }

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 min-w-full shadow-md backdrop-blur-md transition-all duration-200",
        "dark:bg-background/55 bg-white/55",
        { "h-12": scrolled, "h-16": !scrolled },
      )}
      dir="ltr"
    >
      <div className="container mx-auto flex h-full items-center justify-between px-2.5 text-black select-none dark:text-white">
        <div className="flex items-center">
          <Link href="/">
            <ShmsIcon
              className={clsx("transition-all duration-200", {
                "h-8 w-20": scrolled,
                "h-11 w-24": !scrolled,
              })}
            />
          </Link>
        </div>
        <div className="hidden sm:block">
          <NavigationMenu>
            <NavigationMenuList className="rtl:rtl" dir="auto">
              {menuItems.map(item => (
                <NavigationMenuLink
                  key={item.href}
                  href={item.href}
                  className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                >
                  {item.title}
                </NavigationMenuLink>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {user ? (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex justify-between px-0 cursor-pointer">
                <Avatar user={currentUser} className="rounded-md rounded-r-none h-8.5 w-8.5" />
                <span className="pr-2">{truncateUsername(currentUser?.name ?? "User")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44 space-y-2 text-right">
              <DropdownLinkItem href="/dashboard">
                <LayoutDashboard className="h-5 w-5" />
                لوحة التحكم
              </DropdownLinkItem>
              <DropdownLinkItem href="/account">
                <User2 className="h-5 w-5" />
                الحساب
              </DropdownLinkItem>
              {currentUser?.role === "admin" && (
                <DropdownLinkItem href="/admin">
                  <Settings className="h-5 w-5" />
                  الإدارة
                </DropdownLinkItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  variant="destructive"
                  className="w-full cursor-pointer"
                  onClick={handleSignoutClick}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuLink href="/signin">تسجيل الدخول</NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="sm:hidden">
          <NavigationMenu className="z-50">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className="dark:bg-accent dark:text-accent-foreground"
                  title="القائمة المنسدلة"
                  aria-label="القائمة المنسدلة"
                  aria-haspopup="true"
                >
                  <MenuIcon />
                </NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background">
                  <ul className="divide-accent flex w-60 flex-col gap-2 divide-y py-2.5">
                    {menuItems.map(item => (
                      <NavigationMenuLink
                        key={item.title}
                        href={item.href}
                        className="hover:bg-accent w-full rounded-md p-2"
                      >
                        {item.title}
                      </NavigationMenuLink>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  )
}

function Avatar({ user, className }: { user: Session["user"] | undefined; className?: string }) {
  return (
    <AvatarWrapper className={cn("h-8 w-8 select-none shadow", className)}>
      {user?.image ? (
        <AvatarImage
          src={user.image}
          alt={user.name ?? APP_TITLE}
          blurDataURL={user?.blurImageDataURL ?? APP_LOGO_SVG}
          className="object-cover object-top"
        />
      ) : (
        <AvatarFallback className="text-orange-600 rounded-none">
          {fallbackUsername(user?.name ?? APP_TITLE)}
        </AvatarFallback>
      )}
    </AvatarWrapper>
  )
}

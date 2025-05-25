import { LayoutDashboard, MenuIcon, Settings, User2 } from "lucide-react"
import Link from "next/link"
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
import NavWrapper from "./nav-wrapper"
import { SignOutButton } from "./signout-button"
import type { Session } from "next-auth"

export function Nav({ user }: { user: Session["user"] | undefined }) {
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

  return (
    <NavWrapper>
      <div className="container mx-auto flex h-full items-center justify-between px-2.5 text-black select-none dark:text-white">
        <div className="flex items-center">
          <Link href="/">
            <ShmsIcon className="transition-all duration-200 size-14" />
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
                <Avatar user={user} className="rounded-md rounded-r-none h-8.5 w-8.5" />
                <span className="pr-2">{truncateUsername(user?.name ?? "User")}</span>
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
              {user?.role === "admin" && (
                <DropdownLinkItem href="/admin">
                  <Settings className="h-5 w-5" />
                  الإدارة
                </DropdownLinkItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <SignOutButton />
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
    </NavWrapper>
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

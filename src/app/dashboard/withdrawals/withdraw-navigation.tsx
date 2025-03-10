import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

export default function WithdrawNavigation() {
  return (
    <NavigationMenu className="w-full mx-auto mb-3">
      <NavigationMenuList className="flex justify-center gap-2">
        <div className="flex flex-1">
          <NavigationMenuLink className="flex-1" href="/dashboard/withdrawals">
            عمليات السحب
          </NavigationMenuLink>
        </div>
        <div className="flex flex-1">
          <NavigationMenuLink className="flex-1" href="/dashboard/withdrawals/new">
            سحب جديد
          </NavigationMenuLink>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

"use client"

import { Loader2, LogOutIcon } from "lucide-react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { handleSignout } from "@/components/ui/nav-user/actions"

export function SignOutButton() {
  const [_, signoutAction, isSigningOut] = useActionState(handleSignout, null)

  return (
    <form action={signoutAction}>
      <Button className="w-full" variant={"destructive"} disabled={isSigningOut}>
        {isSigningOut ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <LogOutIcon className="size-5" />
        )}
        <span className="hidden sm:inline-flex">تسجيل الخروج</span>
      </Button>
    </form>
  )
}

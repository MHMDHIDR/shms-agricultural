import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth } from "@/server/auth"

export async function StartNowCTA() {
  const session = await auth()

  return (
    <Button className="gap-2" size="lg" asChild>
      <Link href={session ? "/dashboard" : "/signup"}>ابدأ الآن</Link>
    </Button>
  )
}

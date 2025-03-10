import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LoadMore({ href }: { href: string }) {
  return (
    <Link href={href}>
      <Button variant="pressable">المزيد من الأسئلة</Button>
    </Link>
  )
}

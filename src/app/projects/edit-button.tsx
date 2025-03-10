"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function EditButton({ projectId }: { projectId: string }) {
  const router = useRouter()

  return (
    <Button
      variant={"ghost"}
      size={"sm"}
      className="cursor-pointer text-xs px-1.5"
      onClick={e => {
        e.preventDefault()
        router.push(`/admin/projects/${projectId}`)
      }}
    >
      تعديل
    </Button>
  )
}

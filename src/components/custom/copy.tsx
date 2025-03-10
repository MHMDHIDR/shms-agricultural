"use client"

import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export function CopyText({ text, className }: { text: string; className?: string }) {
  const toast = useToast()

  async function handleCopyToClipboard(code: string) {
    try {
      await navigator.clipboard.writeText(code)

      toast.success("تم النسخ")
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "حدث خطاء ما"
      toast.error(errorMsg)
    }
  }

  return (
    <Copy
      onClick={() => handleCopyToClipboard(text)}
      className={cn("cursor-pointer opacity-70 hover:opacity-100", className)}
    />
  )
}

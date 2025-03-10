"use client"

import { MessageCircle } from "lucide-react"
import { MyTooltip } from "@/components/ui/tooltip"
import { ADMIN_PHONE } from "@/lib/constants"

export function ContactWhatsAppWidget() {
  const tooltipText = "تواصل معنا عبر واتساب"

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("السلام عليكم، إسمي: .... ، أريد التحدث عن: ......")
    window.open(`https://wa.me/${ADMIN_PHONE.replace("+", "")}?text=${message}`, "_blank")
  }

  return (
    <MyTooltip text={tooltipText}>
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-12 cursor-pointer right-3 z-50 flex items-center justify-center rounded-full bg-green-500 p-4 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600 active:scale-95"
        aria-label={tooltipText}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </MyTooltip>
  )
}

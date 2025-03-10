"use client"

import { ChevronUp } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MyTooltip } from "@/components/ui/tooltip"
import { scrollToView } from "@/lib/scroll-to-view"

export function NavigateTop({ scrolledHeight = 300 }: { scrolledHeight?: number }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const isSticky = useCallback(() => {
    const scrollTop = window.scrollY
    setIsScrolled(scrollTop > scrolledHeight)
  }, [scrolledHeight])
  useEffect(() => {
    window.addEventListener("scroll", isSticky)
    return () => window.removeEventListener("scroll", isSticky)
  }, [isSticky])

  return (
    <MyTooltip text="الى الأعلى">
      <Button
        variant={"outline"}
        className={`group fixed right-2.5 bottom-2.5 w-fit cursor-pointer opacity-80 transition duration-700 hover:opacity-100 dark:bg-slate-700 ${
          isScrolled ? `translate-x-0` : `translate-x-20`
        }`}
        onClick={() => scrollToView(400)}
        aria-label="الى الأعلى"
      >
        <ChevronUp
          strokeWidth={2}
          className="stroke-green-600 opacity-75 transition-transform group-hover:-translate-y-1 group-hover:scale-110 group-hover:opacity-100 dark:stroke-green-400"
        />
      </Button>
    </MyTooltip>
  )
}

"use client"

import clsx from "clsx"
import React, { useEffect, useState } from "react"

export default function NavWrapper({ children }: { children: React.ReactNode }) {
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

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 min-w-full shadow-md backdrop-blur-md transition-all duration-200",
        "dark:bg-background/55 bg-white/55",
        { "h-12": scrolled, "h-16": !scrolled },
      )}
      dir="ltr"
    >
      {children}
    </nav>
  )
}

"use client"

import { usePathname } from "next/navigation"

export default function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const NotToRenderPaths = ["/admin"]

  return NotToRenderPaths.some(path => pathname.includes(path)) ? null : children
}

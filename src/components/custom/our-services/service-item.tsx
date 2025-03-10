"use client"

import { motion } from "framer-motion"

export function ServiceItem({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <motion.div
      className="rounded-xl border p-2"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      {children}
    </motion.div>
  )
}

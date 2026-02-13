"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  layoutId?: string
  delay?: number
}

export function GlassCard({ children, className, onClick, layoutId, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={onClick ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        "glass rounded-3xl p-6 transition-colors duration-300",
        onClick && "cursor-pointer glass-hover",
        className
      )}
      style={{
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      }}
    >
      {children}
    </motion.div>
  )
}

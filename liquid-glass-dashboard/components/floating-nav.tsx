"use client"

import { motion } from "framer-motion"
import { LayoutGrid, FolderKanban, BarChart3, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutGrid, label: "Home" },
  { icon: FolderKanban, label: "Projects" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Settings, label: "Settings" },
]

interface FloatingNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function FloatingNav({ activeTab, onTabChange }: FloatingNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
    >
      <div
        className="glass flex items-center gap-2 rounded-[28px] p-2"
        style={{ boxShadow: "0 16px 64px rgba(0, 0, 0, 0.5)" }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.label
          return (
            <button
              key={item.label}
              onClick={() => onTabChange(item.label)}
              className={cn(
                "relative flex items-center gap-2 rounded-[20px] px-4 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-[20px]"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <item.icon className="relative z-10 h-5 w-5" />
              {isActive && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="relative z-10 whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          )
        })}
      </div>
    </motion.nav>
  )
}

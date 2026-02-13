"use client"

import type { Status } from "@/lib/data"
import { cn } from "@/lib/utils"

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: { label: "Active", className: "pill-active" },
  review: { label: "In Review", className: "pill-review" },
  todo: { label: "To Do", className: "pill-todo" },
  blocked: { label: "Blocked", className: "pill-blocked" },
}

export function StatusPill({ status }: { status: Status }) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        config.className
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  )
}

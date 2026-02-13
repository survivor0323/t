"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Calendar,
  User,
  Tag,
  Wallet,
  Star,
  ChevronDown,
  AlertCircle,
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { StatusPill } from "@/components/status-pill"
import { ProgressRing } from "@/components/progress-ring"
import type { Project, Status, Priority } from "@/lib/data"

interface DetailSheetProps {
  project: Project | null
  onClose: () => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

const priorityColors: Record<Priority, string> = {
  high: "text-rose-400",
  medium: "text-amber-400",
  low: "text-emerald-400",
}

export function DetailSheet({ project, onClose }: DetailSheetProps) {
  const [isStarred, setIsStarred] = useState(project?.isStarred ?? false)
  const [localStatus, setLocalStatus] = useState<Status>(project?.status ?? "todo")
  const [showStatusPicker, setShowStatusPicker] = useState(false)

  const statuses: Status[] = ["active", "review", "todo", "blocked"]

  if (!project) return null

  const budgetPercent = Math.round((project.spent / project.budget) * 100)

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-[40px] pb-10"
            style={{
              background: "rgba(15, 18, 30, 0.95)",
              backdropFilter: "blur(60px) saturate(1.8)",
              WebkitBackdropFilter: "blur(60px) saturate(1.8)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 -16px 64px rgba(0, 0, 0, 0.6)",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-4 pb-2">
              <div className="flex-1 pr-4">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="rounded-xl px-2.5 py-1 text-xs font-medium"
                    style={{
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    {project.category}
                  </span>
                  <span className={`text-xs font-semibold capitalize ${priorityColors[project.priority]}`}>
                    <AlertCircle className="mr-0.5 inline h-3 w-3" />
                    {project.priority}
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {project.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setIsStarred(!isStarred)}
                  className="glass flex h-10 w-10 items-center justify-center rounded-2xl"
                  aria-label={isStarred ? "Unstar project" : "Star project"}
                >
                  <Star
                    className={`h-5 w-5 transition-colors ${
                      isStarred
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={onClose}
                  className="glass flex h-10 w-10 items-center justify-center rounded-2xl"
                  aria-label="Close detail view"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </motion.button>
              </div>
            </div>

            <div className="px-6 pt-4">
              {/* Description */}
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              {/* Progress Section */}
              <GlassCard className="mb-4 p-5" delay={0.1}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Progress
                    </p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {project.progress}%
                    </p>
                  </div>
                  <ProgressRing progress={project.progress} size={64} strokeWidth={4} />
                </div>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  />
                </div>
              </GlassCard>

              {/* Budget Card */}
              <GlassCard className="mb-4 p-5" delay={0.15}>
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Budget</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">
                        {formatCurrency(project.spent)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / {formatCurrency(project.budget)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      budgetPercent > 80 ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {budgetPercent}%
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className={`h-full rounded-full ${
                      budgetPercent > 80 ? "bg-rose-500" : "bg-emerald-500"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${budgetPercent}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                  />
                </div>
              </GlassCard>

              {/* Detail Fields */}
              <div className="flex flex-col gap-3">
                {/* Status Field */}
                <GlassCard className="p-4" delay={0.2}>
                  <button
                    onClick={() => setShowStatusPicker(!showStatusPicker)}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <StatusPill status={localStatus} />
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        showStatusPicker ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {showStatusPicker && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                          {statuses.map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                setLocalStatus(s)
                                setShowStatusPicker(false)
                              }}
                              className="transition-transform hover:scale-105"
                            >
                              <StatusPill status={s} />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>

                {/* Assignee */}
                <GlassCard className="p-4" delay={0.25}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Assignee</p>
                      <p className="text-sm font-medium text-foreground">
                        {project.assignee}
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Due Date */}
                <GlassCard className="p-4" delay={0.3}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Due Date</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(project.dueDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* Tags */}
                <GlassCard className="p-4" delay={0.35}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs text-muted-foreground">Tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg px-2.5 py-1 text-xs font-medium text-foreground"
                            style={{
                              background: "rgba(255, 255, 255, 0.06)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

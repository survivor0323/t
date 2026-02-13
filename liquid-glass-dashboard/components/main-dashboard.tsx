"use client"

import { motion } from "framer-motion"
import {
  Wallet,
  TrendingUp,
  Layers,
  Zap,
  Star,
  ChevronRight,
  Calendar,
  Search,
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { StatusPill } from "@/components/status-pill"
import { ProgressRing } from "@/components/progress-ring"
import { projects, getStats, type Project } from "@/lib/data"

interface MainDashboardProps {
  onSelectProject: (project: Project) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function MainDashboard({ onSelectProject }: MainDashboardProps) {
  const stats = getStats()

  const statCards = [
    {
      label: "Total Budget",
      value: formatCurrency(stats.totalBudget),
      icon: Wallet,
      accent: "from-blue-500/20 to-blue-600/5",
    },
    {
      label: "Active Projects",
      value: stats.activeCount.toString(),
      icon: Zap,
      accent: "from-emerald-500/20 to-emerald-600/5",
    },
    {
      label: "Avg. Progress",
      value: `${stats.avgProgress}%`,
      icon: TrendingUp,
      accent: "from-amber-500/20 to-amber-600/5",
    },
    {
      label: "Total Projects",
      value: stats.totalProjects.toString(),
      icon: Layers,
      accent: "from-rose-500/20 to-rose-600/5",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col px-5 pb-28 pt-14">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass flex h-10 w-10 items-center justify-center rounded-2xl"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </motion.button>
        </div>
      </motion.header>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-3">
        {statCards.map((stat, i) => (
          <GlassCard key={stat.label} delay={i * 0.08} className="relative overflow-hidden p-5">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.accent} pointer-events-none`}
            />
            <div className="relative">
              <stat.icon className="mb-3 h-5 w-5 text-muted-foreground" />
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Starred Projects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mb-8"
      >
        <h2 className="mb-4 text-lg font-semibold text-foreground">Starred</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {projects
            .filter((p) => p.isStarred)
            .map((project, i) => (
              <GlassCard
                key={project.id}
                delay={0.4 + i * 0.08}
                onClick={() => onSelectProject(project)}
                className="min-w-[200px] shrink-0 p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <StatusPill status={project.status} />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-foreground">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground">{project.assignee}</p>
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                  />
                </div>
              </GlassCard>
            ))}
        </div>
      </motion.div>

      {/* All Projects List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="mb-4 text-lg font-semibold text-foreground">All Projects</h2>
        <div className="flex flex-col gap-3">
          {projects.map((project, i) => (
            <GlassCard
              key={project.id}
              delay={0.55 + i * 0.05}
              onClick={() => onSelectProject(project)}
              className="p-4"
            >
              <div className="flex items-center gap-4">
                <ProgressRing progress={project.progress} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {project.title}
                    </h3>
                    {project.isStarred && (
                      <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <StatusPill status={project.status} />
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(project.dueDate)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

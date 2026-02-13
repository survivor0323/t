"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { FloatingNav } from "@/components/floating-nav"
import { MainDashboard } from "@/components/main-dashboard"
import { DetailSheet } from "@/components/detail-sheet"
import type { Project } from "@/lib/data"

export default function Page() {
  const [activeTab, setActiveTab] = useState("Home")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <main className="mesh-gradient relative min-h-screen">
      <MainDashboard onSelectProject={setSelectedProject} />

      <AnimatePresence>
        {selectedProject && (
          <DetailSheet
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <FloatingNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}

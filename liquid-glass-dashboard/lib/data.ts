export type Status = "active" | "review" | "todo" | "blocked"
export type Priority = "high" | "medium" | "low"

export interface Project {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  progress: number
  assignee: string
  dueDate: string
  category: string
  tags: string[]
  budget: number
  spent: number
  isStarred: boolean
}

export const projects: Project[] = [
  {
    id: "proj-001",
    title: "Design System v4",
    description: "Complete overhaul of the component library with new tokens, variants, and accessibility improvements across all platforms.",
    status: "active",
    priority: "high",
    progress: 72,
    assignee: "Sarah Chen",
    dueDate: "2026-03-15",
    category: "Design",
    tags: ["UI", "Components", "Tokens"],
    budget: 48000,
    spent: 34560,
    isStarred: true,
  },
  {
    id: "proj-002",
    title: "AI Chat Integration",
    description: "Integrate conversational AI assistant into the main product dashboard with streaming responses and context memory.",
    status: "active",
    priority: "high",
    progress: 45,
    assignee: "Marcus Rivera",
    dueDate: "2026-04-01",
    category: "Engineering",
    tags: ["AI", "Backend", "API"],
    budget: 85000,
    spent: 38250,
    isStarred: true,
  },
  {
    id: "proj-003",
    title: "Mobile App Redesign",
    description: "Redesign the native mobile experience with Liquid Glass aesthetics and improved gesture-based navigation.",
    status: "review",
    priority: "medium",
    progress: 88,
    assignee: "Yuki Tanaka",
    dueDate: "2026-02-28",
    category: "Design",
    tags: ["Mobile", "iOS", "UX"],
    budget: 62000,
    spent: 54560,
    isStarred: false,
  },
  {
    id: "proj-004",
    title: "Analytics Pipeline",
    description: "Build real-time analytics pipeline with event streaming, data warehouse integration, and automated dashboards.",
    status: "todo",
    priority: "medium",
    progress: 12,
    assignee: "Alex Kim",
    dueDate: "2026-05-10",
    category: "Data",
    tags: ["Analytics", "Pipeline", "ETL"],
    budget: 72000,
    spent: 8640,
    isStarred: false,
  },
  {
    id: "proj-005",
    title: "Security Audit",
    description: "Comprehensive security review including penetration testing, dependency scanning, and compliance certification.",
    status: "blocked",
    priority: "high",
    progress: 30,
    assignee: "Jordan Blake",
    dueDate: "2026-03-01",
    category: "Security",
    tags: ["Audit", "Compliance", "Pentest"],
    budget: 35000,
    spent: 10500,
    isStarred: false,
  },
  {
    id: "proj-006",
    title: "Onboarding Flow",
    description: "New user onboarding experience with interactive tutorials, progressive disclosure, and personalized setup wizard.",
    status: "active",
    priority: "low",
    progress: 55,
    assignee: "Priya Patel",
    dueDate: "2026-04-20",
    category: "Product",
    tags: ["UX", "Growth", "Onboarding"],
    budget: 28000,
    spent: 15400,
    isStarred: true,
  },
  {
    id: "proj-007",
    title: "Performance Optimization",
    description: "Core Web Vitals optimization sprint targeting LCP under 1.2s and CLS near zero across all critical pages.",
    status: "review",
    priority: "high",
    progress: 91,
    assignee: "Sarah Chen",
    dueDate: "2026-02-20",
    category: "Engineering",
    tags: ["Performance", "CWV", "Frontend"],
    budget: 22000,
    spent: 20020,
    isStarred: false,
  },
  {
    id: "proj-008",
    title: "API v3 Migration",
    description: "Migrate all clients from API v2 to v3 with backward compatibility layer and automated migration tooling.",
    status: "todo",
    priority: "medium",
    progress: 5,
    assignee: "Marcus Rivera",
    dueDate: "2026-06-01",
    category: "Engineering",
    tags: ["API", "Migration", "Backend"],
    budget: 55000,
    spent: 2750,
    isStarred: false,
  },
]

export function getStats() {
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
  const activeCount = projects.filter((p) => p.status === "active").length
  const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)

  return { totalBudget, totalSpent, activeCount, avgProgress, totalProjects: projects.length }
}

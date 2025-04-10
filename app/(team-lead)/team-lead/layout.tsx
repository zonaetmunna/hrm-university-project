import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import type React from "react"

export default function TeamLeadLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout userRole="team-lead">{children}</DashboardLayout>
}

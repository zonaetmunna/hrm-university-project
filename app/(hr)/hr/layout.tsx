import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import type React from "react"

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout userRole="hr">{children}</DashboardLayout>
}

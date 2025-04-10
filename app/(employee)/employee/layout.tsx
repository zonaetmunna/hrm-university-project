import type React from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout userRole="employee">{children}</DashboardLayout>
}

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import type React from "react"

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout userRole="employee">{children}</DashboardLayout>
}

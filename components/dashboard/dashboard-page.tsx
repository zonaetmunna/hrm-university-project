"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DepartmentManagement } from "@/components/dashboard/department-management"
import { RoleManagement } from "@/components/dashboard/role-management"
import { SidebarProvider } from "@/components/dashboard/sidebar-provider"
import { UserManagement } from "@/components/dashboard/user-management"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  
  // Update active tab based on URL pathname
  useEffect(() => {
    if (pathname.includes("/users")) {
      setActiveTab("users")
    } else if (pathname.includes("/departments")) {
      setActiveTab("departments")
    } else if (pathname.includes("/roles")) {
      setActiveTab("roles")
    } else {
      setActiveTab("overview")
    }
  }, [pathname])
  
  const handleLogout = () => {
    // Implement logout functionality
    console.log("Logging out...")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          userRole="admin" 
          onLogout={handleLogout} 
        />
        <div className="flex flex-1">
          <DashboardSidebar 
            isOpen={sidebarOpen} 
            userRole="admin" 
            onLogout={handleLogout} 
          />
          <main className="flex-1 p-6">
            {activeTab === "overview" && <DashboardOverview />}
            {activeTab === "users" && <UserManagement />}
            {activeTab === "departments" && <DepartmentManagement />}
            {activeTab === "roles" && <RoleManagement />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

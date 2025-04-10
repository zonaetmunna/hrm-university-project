"use client"

import type React from "react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: string
}

export function DashboardLayout({ children, userRole: propUserRole }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userRole, setUserRole] = useState(propUserRole || "")
  const pathname = usePathname()
  const router = useRouter()

  // Get user role from localStorage if not provided as prop
  useEffect(() => {
    if (!propUserRole) {
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        setUserRole(user.role)
      } else {
        // Redirect to login if no user found
        router.push("/login")
      }
    }
  }, [propUserRole, router])

  // Handle sidebar toggle for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [pathname])

  // Handle logout
  const handleLogout = async () => {
    // Use NextAuth signOut method
    await signOut({ redirect: false })
    
    // Also clear any localStorage if needed
    localStorage.removeItem("currentUser")
    
    // Redirect to login page
    router.push("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader toggleSidebar={toggleSidebar} userRole={userRole} onLogout={handleLogout} />
      <div className="flex flex-1">
        <DashboardSidebar isOpen={sidebarOpen} userRole={userRole} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 dark:bg-gray-900 md:p-6">{children}</main>
      </div>
    </div>
  )
}

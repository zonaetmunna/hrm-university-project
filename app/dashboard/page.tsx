"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // In a real application, you would get the user role from a secure cookie or context
    // For demo purposes, we'll use localStorage
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserRole(user.role)

      // Redirect to role-specific dashboard
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else if (user.role === "hr") {
        router.push("/hr/dashboard")
      } else if (user.role === "team-lead") {
        router.push("/team-lead/dashboard")
      } else if (user.role === "employee") {
        router.push("/employee/dashboard")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to your dashboard...</h1>
        <p className="text-muted-foreground">Please wait while we load your personalized dashboard.</p>
      </div>
    </div>
  )
}

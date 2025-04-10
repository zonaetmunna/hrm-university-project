"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is logged in and is an admin
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    
    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        router.push("/dashboard")
        return
      }
      
      setIsAuthorized(true)
    }
  }, [router, session, status])

  // Show nothing while checking authorization
  if (isAuthorized === null) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  // Show admin dashboard once authorized
  return <DashboardLayout userRole="admin">{children}</DashboardLayout>
}

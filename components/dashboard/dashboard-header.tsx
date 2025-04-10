"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Bell, LogOut, Menu, Settings, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DashboardHeaderProps {
  toggleSidebar: () => void
  userRole: string
  onLogout: () => void
}

export function DashboardHeader({ toggleSidebar, userRole, onLogout }: DashboardHeaderProps) {
  const [userName, setUserName] = useState("User")

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      setUserName(user.name || "User")
    }
  }, [])

  const handleLogout = () => {
    onLogout()
  }

  console.log(userRole)

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator"
      case "hr":
        return "HR Manager"
      case "team-lead":
        return "Team Lead"
      case "employee":
        return "Employee"
      default:
        return role
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="hidden md:flex md:items-center md:gap-2">
          <Link href={`/${userRole}/dashboard`} className="flex items-center gap-2 font-semibold">
            <span>HR Management System</span>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-2 text-center text-sm">No new notifications</div>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{getRoleDisplay(userRole)}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/${userRole}/profile`}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/${userRole}/settings`}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

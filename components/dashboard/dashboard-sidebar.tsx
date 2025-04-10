"use client"

import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Briefcase,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  GraduationCap,
  Laptop,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Package2,
  Receipt,
  Settings,
  ShieldCheck,
  TrendingUp,
  User,
  UserPlus,
  Users
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardSidebarProps {
  isOpen?: boolean;
  userRole?: string;
  onLogout?: () => void;
}

export function DashboardSidebar({ isOpen, userRole, onLogout }: DashboardSidebarProps) {
  const pathname = usePathname()

  // Define menu items based on user role
  const adminMenuItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      id: "overview"
    },
    {
      title: "User Management",
      href: "/admin/users",
      icon: Users,
      id: "users"
    },
    {
      title: "Roles & Permissions",
      href: "/admin/roles",
      icon: ShieldCheck,
      id: "roles"
    },
    {
      title: "Departments",
      href: "/admin/departments",
      icon: Building2,
      id: "departments"
    },
    {
      title: "Leave Policies",
      href: "/admin/leave-policies",
      icon: Calendar,
    },
    {
      title: "Salary Structures",
      href: "/admin/salary-structures",
      icon: CreditCard,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
    },
    {
      title: "System Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const hrMenuItems = [
    {
      title: "Dashboard",
      href: "/hr/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Employee Onboarding",
      href: "/hr/onboarding",
      icon: UserPlus,
    },
    {
      title: "Employee Profiles",
      href: "/hr/employees",
      icon: Users,
    },
    {
      title: "Attendance",
      href: "/hr/attendance",
      icon: Calendar,
    },
    {
      title: "Leave Management",
      href: "/hr/leaves",
      icon: FileText,
    },
    {
      title: "Documents",
      href: "/hr/documents",
      icon: FileText,
    },
    {
      title: "Payroll",
      href: "/hr/payroll",
      icon: CreditCard,
    },
    {
      title: "Appraisals",
      href: "/hr/appraisals",
      icon: TrendingUp,
    },
    {
      title: "Announcements",
      href: "/hr/announcements",
      icon: Mail,
    },
    {
      title: "Reports",
      href: "/hr/reports",
      icon: BarChart3,
    },
  ]

  const teamLeadMenuItems = [
    {
      title: "Dashboard",
      href: "/team-lead/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Team Members",
      href: "/team-lead/team",
      icon: Users,
    },
    {
      title: "Attendance",
      href: "/team-lead/attendance",
      icon: Calendar,
    },
    {
      title: "Leave Approvals",
      href: "/team-lead/leaves",
      icon: FileText,
    },
    {
      title: "Performance",
      href: "/team-lead/performance",
      icon: TrendingUp,
    },
    {
      title: "Projects",
      href: "/team-lead/projects",
      icon: Briefcase,
    },
    {
      title: "Feedback",
      href: "/team-lead/feedback",
      icon: MessageSquare,
    },
  ]

  const employeeMenuItems = [
    {
      title: "Dashboard",
      href: "/employee/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Profile",
      href: "/employee/profile",
      icon: User,
    },
    {
      title: "Leave",
      href: "/employee/leaves",
      icon: Calendar,
    },
    {
      title: "Attendance",
      href: "/employee/attendance",
      icon: FileText,
    },
    {
      title: "Payslips",
      href: "/employee/payslips",
      icon: CreditCard,
    },
    {
      title: "Documents",
      href: "/employee/documents",
      icon: FileText,
    },
    {
      title: "Announcements",
      href: "/employee/announcements",
      icon: Mail,
    },
    {
      title: "Goals",
      href: "/employee/goals",
      icon: TrendingUp,
    },
    {
      title: "Support",
      href: "/employee/support",
      icon: LifeBuoy,
    },
  ]

  // Extra modules - shown to Admin and HR
  const extraModules = [
    {
      title: "Recruitment",
      href: `/${userRole}/recruitment`,
      icon: Briefcase,
    },
    {
      title: "Training",
      href: `/${userRole}/training`,
      icon: GraduationCap,
    },
    {
      title: "Performance",
      href: `/${userRole}/performance`,
      icon: TrendingUp,
    },
    {
      title: "Expenses",
      href: `/${userRole}/expenses`,
      icon: Receipt,
    },
    {
      title: "Assets",
      href: `/${userRole}/assets`,
      icon: Laptop,
    },
  ]

  // Determine which menu to display based on user role
  const menuItems = 
    userRole === "admin" ? adminMenuItems : 
    userRole === "hr" ? hrMenuItems :
    userRole === "team_lead" ? teamLeadMenuItems : 
    employeeMenuItems;

  if (!isOpen) {
    return null; // Don't render sidebar if it's closed
  }

  return (
    <div className="fixed inset-y-0 left-0 z-20 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:translate-x-0">
      <div className="flex h-16 items-center border-b px-6">
        <Link href={`/${userRole}/dashboard`} className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span>HR System</span>
        </Link>
      </div>
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        {userRole === "admin" && (
          <>
            <div className="px-3 py-2 mt-6">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Extra Modules
              </h2>
              <nav className="space-y-1">
                {extraModules.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}

        <div className="mt-auto px-3 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Calendar,
  CreditCard,
  UserPlus,
  Users
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalUsers: number
  totalDepartments: number
  pendingLeaves: number
  totalPayroll: number
}

interface Department {
  id: string
  name: string
  employeeCount: number
}

interface RecentActivity {
  id: string
  type: string
  user: string
  action: string
  timestamp: string
}

// Sample department data - replace with API call once available
const departmentData: Department[] = [
  { id: "1", name: "Engineering", employeeCount: 312 },
  { id: "2", name: "Marketing", employeeCount: 156 },
  { id: "3", name: "Sales", employeeCount: 243 },
  { id: "4", name: "Finance", employeeCount: 87 },
  { id: "5", name: "HR", employeeCount: 42 },
]

// Sample recent activities - replace with API call once available
const recentActivities: RecentActivity[] = [
  { id: "1", type: "user", user: "John Doe", action: "Created a new user account", timestamp: "2 hours ago" },
  { id: "2", type: "leave", user: "Jane Smith", action: "Approved leave request", timestamp: "4 hours ago" },
  { id: "3", type: "department", user: "Admin", action: "Created new department: Design", timestamp: "Yesterday" },
  { id: "4", type: "payroll", user: "Finance Manager", action: "Processed monthly payroll", timestamp: "2 days ago" },
  { id: "5", type: "user", user: "HR Manager", action: "Updated employee profile", timestamp: "3 days ago" },
]

export function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
    totalPayroll: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [systemStatus, setSystemStatus] = useState({
    cpu: Math.floor(Math.random() * 50) + 10, // Random CPU usage between 10-60%
    memory: Math.floor(Math.random() * 40) + 30, // Random memory usage between 30-70%
    storage: Math.floor(Math.random() * 30) + 40, // Random storage usage between 40-70%
    lastBackup: "2023-09-15 04:30 AM", // Mock last backup time
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/dashboard/stats")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard statistics")
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error("Error fetching dashboard stats:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
        // Set fallback data for demo purposes
        setStats({
          totalUsers: 840,
          totalDepartments: 5,
          pendingLeaves: 24,
          totalPayroll: 1240000,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Calculate total employees
  const totalEmployees = departmentData.reduce((sum, dept) => sum + dept.employeeCount, 0)

  // For the quick actions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "addUser":
        router.push("/admin/users?new=true")
        break
      case "addDepartment":
        router.push("/admin/departments?new=true")
        break
      case "setHoliday":
        router.push("/admin/leave-policies?action=holiday")
        break
      case "runPayroll":
        router.push("/admin/salary-structures?action=run")
        break
      default:
        break
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading dashboard data...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your HR system.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDepartments}</div>
            <p className="text-xs text-muted-foreground mt-1">Active company departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLeaves}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Monthly payment projection</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Employee count by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map(dept => {
                    const percentage = Math.round((dept.employeeCount / totalEmployees) * 100)
                    return (
                      <div className="space-y-2" key={dept.id}>
                        <div className="flex items-center justify-between text-sm">
                          <div className="font-medium">{dept.name}</div>
                          <div className="text-muted-foreground">{dept.employeeCount} employees</div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Statistics</CardTitle>
                <CardDescription>Leave requests and approvals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Pending Approvals</div>
                    <div className="text-2xl font-bold">{stats.pendingLeaves}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Approved This Month</div>
                    <div className="text-2xl font-bold">87</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Rejected This Month</div>
                    <div className="text-2xl font-bold">12</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Average Processing Time</div>
                    <div className="text-2xl font-bold">1.2 days</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary</CardTitle>
                <CardDescription>Current month payroll status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Total Payroll Amount</div>
                    <div className="text-2xl font-bold">${(stats.totalPayroll / 1000000).toFixed(2)}M</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Payroll Status</div>
                    <div className="text-sm font-medium text-amber-500">In Progress</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Processing Date</div>
                    <div className="text-sm font-medium">25th of Month</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Next Payroll</div>
                    <div className="text-sm font-medium">12 days remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => handleQuickAction("addUser")}
                  >
                    <UserPlus className="h-5 w-5 mb-1" />
                    <span>Add User</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => handleQuickAction("addDepartment")}
                  >
                    <Building2 className="h-5 w-5 mb-1" />
                    <span>Add Department</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => handleQuickAction("setHoliday")}
                  >
                    <Calendar className="h-5 w-5 mb-1" />
                    <span>Set Holiday</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center"
                    onClick={() => handleQuickAction("runPayroll")}
                  >
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span>Run Payroll</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HR Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Onboarding Efficiency</div>
                      <div className="text-emerald-500 font-medium">+12% ↑</div>
                    </div>
                    <Progress value={78} className="h-2 bg-emerald-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Leave Approval Rate</div>
                      <div className="text-emerald-500 font-medium">+5% ↑</div>
                    </div>
                    <Progress value={85} className="h-2 bg-emerald-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Employee Satisfaction</div>
                      <div className="text-red-500 font-medium">-3% ↓</div>
                    </div>
                    <Progress value={72} className="h-2 bg-red-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">Recruitment Time</div>
                      <div className="text-emerald-500 font-medium">+8% ↑</div>
                    </div>
                    <Progress value={65} className="h-2 bg-emerald-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.user}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current server and database status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">CPU Usage</div>
                    <div className="text-muted-foreground">{systemStatus.cpu}%</div>
                  </div>
                  <Progress value={systemStatus.cpu} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Memory Usage</div>
                    <div className="text-muted-foreground">{systemStatus.memory}%</div>
                  </div>
                  <Progress value={systemStatus.memory} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Storage Usage</div>
                    <div className="text-muted-foreground">{systemStatus.storage}%</div>
                  </div>
                  <Progress value={systemStatus.storage} className="h-2" />
                </div>
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">System Information</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Environment:</span>
                      <span>Production</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Backup:</span>
                      <span>{systemStatus.lastBackup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <span>1.5.2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Database:</span>
                      <span className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        Healthy
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

 
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import {
  AlertCircle,
  BarChart2,
  Calendar,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  UserPlus,
  Users,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

/**
 * HR Dashboard Component
 * 
 * Main dashboard for HR personnel showing key statistics, recent activities,
 * and quicklinks for HR tasks.
 * 
 * @returns {JSX.Element} The HR dashboard
 */
export function HRDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/hr/dashboard')
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    // For now, we'll use mock data until the API is implemented
    setDashboardData(mockDashboardData)
    setIsLoading(false)

    // Uncomment when API is ready
    fetchDashboardData()
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard data...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500">Error: {error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">HR Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your HR department.
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.stats.newEmployees > 0 
                ? `+${dashboardData.stats.newEmployees} this month` 
                : "No change this month"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.pendingLeaveRequests}</div>
            <p className="text-xs text-muted-foreground">Require your approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.attendanceRate}%</div>
            <Progress value={dashboardData.stats.attendanceRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboarding Status</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.onboardingInProgress}</div>
            <p className="text-xs text-muted-foreground">Employees in onboarding</p>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="quicklinks">Quick Links</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Department Distribution */}
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Department Distribution</CardTitle>
                <CardDescription>Employee count by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.departments.map((dept: any) => (
                    <div key={dept.id} className="flex items-center">
                      <div className="w-1/3 font-medium">{dept.name}</div>
                      <div className="w-2/3 flex items-center gap-2">
                        <Progress value={dept.percentage} className="h-2" />
                        <span className="text-sm text-muted-foreground w-12">
                          {dept.employeeCount} ({dept.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/hr/employees" className="gap-1">
                    View Employees <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming Events */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.upcomingEvents.map((event: any) => (
                    <div key={event.id} className="flex items-start gap-2">
                      <div className="bg-primary/10 p-2 rounded text-primary">
                        {event.type === 'birthday' && <FileText className="h-4 w-4" />}
                        {event.type === 'event' && <Calendar className="h-4 w-4" />}
                        {event.type === 'review' && <ClipboardList className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(event.date), 'EEEE, MMMM d')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Leave Requests Overview */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Leave Requests Status</CardTitle>
                <CardDescription>Current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Approved</p>
                      <p className="text-xs text-muted-foreground">{dashboardData.leaveStats.approved} requests</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-900/20">
                        {dashboardData.leaveStats.approvedPercentage}%
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Pending</p>
                      <p className="text-xs text-muted-foreground">{dashboardData.leaveStats.pending} requests</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20">
                        {dashboardData.leaveStats.pendingPercentage}%
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Rejected</p>
                      <p className="text-xs text-muted-foreground">{dashboardData.leaveStats.rejected} requests</p>
                    </div>
                    <div>
                      <Badge variant="outline" className="text-red-600 bg-red-50 dark:bg-red-900/20">
                        {dashboardData.leaveStats.rejectedPercentage}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/hr/leaves" className="gap-1">
                    View All Leaves <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Current Payroll */}
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Current Payroll</CardTitle>
                <CardDescription>For {format(new Date(), 'MMMM yyyy')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Amount</p>
                      </div>
                    </div>
                    <p className="font-bold">${dashboardData.payroll.totalAmount.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Employees</p>
                      </div>
                    </div>
                    <p className="font-medium">{dashboardData.payroll.employeeCount}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart2 className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Average Salary</p>
                      </div>
                    </div>
                    <p className="font-medium">${dashboardData.payroll.averageSalary.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Payment Date</p>
                      </div>
                    </div>
                    <p className="font-medium">
                      {format(new Date(dashboardData.payroll.paymentDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/hr/payroll" className="gap-1">
                    Manage Payroll <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Recent Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dashboardData.recentActivities.map((activity: any) => (
                  <div key={activity.id} className="flex">
                    <div className="relative mr-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                          <AvatarFallback>{activity.userInitials}</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="absolute top-0 right-0 flex h-3 w-3 rounded-full bg-primary"></span>
                      <div className="absolute top-10 bottom-0 left-4 w-px -ml-px bg-border"></div>
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="text-sm font-medium">{activity.userName}</div>
                      <div className="text-sm text-muted-foreground">{activity.action}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {format(new Date(activity.timestamp), 'MMM d, yyyy • h:mm a')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Links Tab */}
        <TabsContent value="quicklinks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>Manage employee information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/hr/employees">
                    <Users className="mr-2 h-4 w-4" />
                    View All Employees
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/hr/onboarding">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Onboard New Employee
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Management</CardTitle>
                <CardDescription>Manage employee leaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/hr/leaves">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Leave Requests
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/hr/leaves?filter=pending">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Pending Approvals
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance & Payroll</CardTitle>
                <CardDescription>Track attendance and process payroll</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/hr/attendance">
                    <Clock className="mr-2 h-4 w-4" />
                    View Attendance
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/hr/payroll">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Process Payroll
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock data for the dashboard
const mockDashboardData = {
  stats: {
    totalEmployees: 125,
    newEmployees: 3,
    pendingLeaveRequests: 8,
    attendanceRate: 96.5,
    onboardingInProgress: 2
  },
  departments: [
    { id: 1, name: 'Engineering', employeeCount: 42, percentage: 33.6 },
    { id: 2, name: 'Marketing', employeeCount: 18, percentage: 14.4 },
    { id: 3, name: 'Finance', employeeCount: 15, percentage: 12.0 },
    { id: 4, name: 'Human Resources', employeeCount: 12, percentage: 9.6 },
    { id: 5, name: 'Operations', employeeCount: 38, percentage: 30.4 }
  ],
  upcomingEvents: [
    { 
      id: 1, 
      type: 'birthday', 
      title: 'John Smith\'s Birthday', 
      date: '2023-05-15T00:00:00Z'
    },
    { 
      id: 2, 
      type: 'event', 
      title: 'Company Town Hall', 
      date: '2023-05-17T14:00:00Z'
    },
    { 
      id: 3, 
      type: 'review', 
      title: 'Quarterly Performance Reviews', 
      date: '2023-05-20T00:00:00Z'
    },
    { 
      id: 4, 
      type: 'event', 
      title: 'New Employee Orientation', 
      date: '2023-05-22T09:00:00Z'
    }
  ],
  leaveStats: {
    approved: 15,
    approvedPercentage: 50,
    pending: 8,
    pendingPercentage: 27,
    rejected: 7,
    rejectedPercentage: 23
  },
  payroll: {
    totalAmount: 875450,
    employeeCount: 125,
    averageSalary: 7003.60,
    paymentDate: '2023-04-30T00:00:00Z'
  },
  recentActivities: [
    {
      id: 1,
      userName: 'Sarah Johnson',
      userAvatar: '/placeholder.svg',
      userInitials: 'SJ',
      action: 'Approved leave request for Michael Brown',
      timestamp: '2023-04-25T09:15:00Z'
    },
    {
      id: 2,
      userName: 'David Wilson',
      userAvatar: '/placeholder.svg',
      userInitials: 'DW',
      action: 'Added new employee: Emma Thompson',
      timestamp: '2023-04-24T14:30:00Z'
    },
    {
      id: 3,
      userName: 'Sarah Johnson',
      userAvatar: '/placeholder.svg',
      userInitials: 'SJ',
      action: 'Generated payroll for April 2023',
      timestamp: '2023-04-23T11:20:00Z'
    },
    {
      id: 4,
      userName: 'Lisa Miller',
      userAvatar: '/placeholder.svg',
      userInitials: 'LM',
      action: 'Updated department structure',
      timestamp: '2023-04-22T16:45:00Z'
    }
  ]
}

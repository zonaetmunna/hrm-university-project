"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarIcon,
  CheckCircle,
  Clock,
  Download,
  Filter,
  Search,
  XCircle,
} from "lucide-react"
import { useState } from "react"

// Mock data for attendance
const attendanceData = [
  {
    id: 1,
    employee: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg",
      initials: "JD",
    },
    date: "2023-04-10",
    checkIn: "09:02 AM",
    checkOut: "05:45 PM",
    status: "Present",
    workHours: "8h 43m",
    department: "Engineering",
  },
  {
    id: 2,
    employee: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/placeholder.svg",
      initials: "JS",
    },
    date: "2023-04-10",
    checkIn: "08:55 AM",
    checkOut: "06:10 PM",
    status: "Present",
    workHours: "9h 15m",
    department: "Marketing",
  },
  {
    id: 3,
    employee: {
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      avatar: "/placeholder.svg",
      initials: "RJ",
    },
    date: "2023-04-10",
    checkIn: "09:30 AM",
    checkOut: "05:30 PM",
    status: "Present",
    workHours: "8h 00m",
    department: "Finance",
  },
  {
    id: 4,
    employee: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      avatar: "/placeholder.svg",
      initials: "ED",
    },
    date: "2023-04-10",
    checkIn: "10:15 AM",
    checkOut: "06:30 PM",
    status: "Late",
    workHours: "8h 15m",
    department: "Human Resources",
  },
  {
    id: 5,
    employee: {
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      avatar: "/placeholder.svg",
      initials: "MW",
    },
    date: "2023-04-10",
    checkIn: "--:--",
    checkOut: "--:--",
    status: "Absent",
    workHours: "0h 00m",
    department: "Engineering",
  },
]

export function AttendanceManagement() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [department, setDepartment] = useState<string>("all")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance Management</h2>
          <p className="text-muted-foreground">Track and manage employee attendance records.</p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button>Generate Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 3%
              </span>
              from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-red-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 2
              </span>
              from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3 mr-1" /> 5%
              </span>
              from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-amber-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 3
              </span>
              from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search employees..." />
            </div>
            <div className="flex items-center gap-2">
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={record.employee.avatar} alt={record.employee.name} />
                          <AvatarFallback>{record.employee.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{record.employee.name}</div>
                          <div className="text-xs text-muted-foreground">{record.employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>{record.workHours}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {record.status === "Present" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : record.status === "Absent" ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-500" />
                        )}
                        <span
                          className={`text-sm ${
                            record.status === "Present"
                              ? "text-green-500"
                              : record.status === "Absent"
                                ? "text-red-500"
                                : "text-amber-500"
                          }`}
                        >
                          {record.status}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Overview</CardTitle>
              <CardDescription>Attendance statistics for the current week</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground" />
              <span className="ml-4 text-muted-foreground">Weekly attendance chart visualization</span>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Trends</CardTitle>
              <CardDescription>Attendance statistics for the current month</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground" />
              <span className="ml-4 text-muted-foreground">Monthly attendance chart visualization</span>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Department Attendance</CardTitle>
          <CardDescription>Attendance rate by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">Engineering</div>
                <div className="text-muted-foreground">96.5%</div>
              </div>
              <Progress value={96.5} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">Marketing</div>
                <div className="text-muted-foreground">94.2%</div>
              </div>
              <Progress value={94.2} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">Finance</div>
                <div className="text-muted-foreground">98.7%</div>
              </div>
              <Progress value={98.7} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">Human Resources</div>
                <div className="text-muted-foreground">97.3%</div>
              </div>
              <Progress value={97.3} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">Sales</div>
                <div className="text-muted-foreground">92.8%</div>
              </div>
              <Progress value={92.8} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

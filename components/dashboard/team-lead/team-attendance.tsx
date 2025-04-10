/* eslint-disable react/no-unescaped-entities */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
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
  Mail,
  MessageSquare,
  MoreHorizontal,
  Search,
  XCircle,
} from "lucide-react"
import { useState } from "react"

// Mock data for team attendance
const teamAttendanceData = [
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
    position: "Senior Developer",
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
    position: "UX Designer",
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
    position: "Backend Developer",
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
    position: "UI Designer",
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
    position: "Frontend Developer",
  },
]

export function TeamAttendance() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [attendanceStatus, setAttendanceStatus] = useState<string>("all")

  const filteredAttendance =
    attendanceStatus === "all"
      ? teamAttendanceData
      : teamAttendanceData.filter((record) => record.status.toLowerCase() === attendanceStatus.toLowerCase())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Attendance</h2>
          <p className="text-muted-foreground">Monitor and manage your team's attendance.</p>
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
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 1
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
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-red-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 1
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
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3 mr-1" /> 1
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-gray-500 flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3 mr-1" /> 0
              </span>
              from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search team members..." />
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {attendanceStatus === "all" ? "All Status" : attendanceStatus}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="end">
              <div className="p-2">
                <div
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted cursor-pointer"
                  onClick={() => setAttendanceStatus("all")}
                >
                  <span className="text-sm">All Status</span>
                </div>
                <div
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted cursor-pointer"
                  onClick={() => setAttendanceStatus("present")}
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Present</span>
                </div>
                <div
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted cursor-pointer"
                  onClick={() => setAttendanceStatus("absent")}
                >
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Absent</span>
                </div>
                <div
                  className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted cursor-pointer"
                  onClick={() => setAttendanceStatus("late")}
                >
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Late</span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
              <TableHead>Position</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Work Hours</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendance.map((record) => (
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
                <TableCell>{record.position}</TableCell>
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
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clock className="mr-2 h-4 w-4" />
                        View History
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Overview</CardTitle>
              <CardDescription>Team attendance for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Monday</div>
                    <div className="text-muted-foreground">100% Present</div>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Tuesday</div>
                    <div className="text-muted-foreground">100% Present</div>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Wednesday</div>
                    <div className="text-muted-foreground">80% Present, 20% Late</div>
                  </div>
                  <div className="flex w-full gap-0.5">
                    <Progress value={80} className="h-2" />
                    <Progress value={20} className="h-2 bg-amber-100 [&>div]:bg-amber-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Thursday</div>
                    <div className="text-muted-foreground">60% Present, 20% Late, 20% Absent</div>
                  </div>
                  <div className="flex w-full gap-0.5">
                    <Progress value={60} className="h-2" />
                    <Progress value={20} className="h-2 bg-amber-100 [&>div]:bg-amber-500" />
                    <Progress value={20} className="h-2 bg-red-100 [&>div]:bg-red-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">Friday</div>
                    <div className="text-muted-foreground">Today</div>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Trends</CardTitle>
              <CardDescription>Team attendance statistics for the current month</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground" />
              <span className="ml-4 text-muted-foreground">Monthly attendance chart visualization</span>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Team Member Performance</CardTitle>
          <CardDescription>Attendance rate by team member</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">John Doe</div>
                <div className="text-muted-foreground">98.5% Attendance Rate</div>
              </div>
              <Progress value={98.5} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">Jane Smith</div>
                <div className="text-muted-foreground">100% Attendance Rate</div>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">Robert Johnson</div>
                <div className="text-muted-foreground">95.2% Attendance Rate</div>
              </div>
              <Progress value={95.2} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">Emily Davis</div>
                <div className="text-muted-foreground">92.8% Attendance Rate</div>
              </div>
              <Progress value={92.8} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium">Michael Wilson</div>
                <div className="text-muted-foreground">88.5% Attendance Rate</div>
              </div>
              <Progress value={88.5} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

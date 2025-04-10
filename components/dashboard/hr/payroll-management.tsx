"use client"

import { Calendar } from "@/components/ui/calendar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarIcon,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  Mail,
  MoreHorizontal,
  Printer,
  Search,
  Users,
} from "lucide-react"
import { useState } from "react"

// Mock data for payroll
const payrollData = [
  {
    id: 1,
    employee: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg",
      initials: "JD",
    },
    employeeId: "EMP001",
    department: "Engineering",
    position: "Senior Developer",
    salary: "$8,500.00",
    status: "Processed",
    paymentDate: "2023-04-30",
  },
  {
    id: 2,
    employee: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/placeholder.svg",
      initials: "JS",
    },
    employeeId: "EMP002",
    department: "Marketing",
    position: "Marketing Manager",
    salary: "$7,200.00",
    status: "Processed",
    paymentDate: "2023-04-30",
  },
  {
    id: 3,
    employee: {
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      avatar: "/placeholder.svg",
      initials: "RJ",
    },
    employeeId: "EMP003",
    department: "Finance",
    position: "Financial Analyst",
    salary: "$6,800.00",
    status: "Pending",
    paymentDate: "2023-04-30",
  },
  {
    id: 4,
    employee: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      avatar: "/placeholder.svg",
      initials: "ED",
    },
    employeeId: "EMP004",
    department: "Human Resources",
    position: "HR Specialist",
    salary: "$6,500.00",
    status: "Pending",
    paymentDate: "2023-04-30",
  },
  {
    id: 5,
    employee: {
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      avatar: "/placeholder.svg",
      initials: "MW",
    },
    employeeId: "EMP005",
    department: "Engineering",
    position: "Frontend Developer",
    salary: "$7,000.00",
    status: "Processed",
    paymentDate: "2023-04-30",
  },
]

// Mock data for payroll history
const payrollHistory = [
  {
    id: 1,
    period: "March 2023",
    totalEmployees: 125,
    totalAmount: "$875,450.00",
    processedDate: "2023-03-31",
    status: "Completed",
  },
  {
    id: 2,
    period: "February 2023",
    totalEmployees: 122,
    totalAmount: "$862,300.00",
    processedDate: "2023-02-28",
    status: "Completed",
  },
  {
    id: 3,
    period: "January 2023",
    totalEmployees: 120,
    totalAmount: "$845,750.00",
    processedDate: "2023-01-31",
    status: "Completed",
  },
]

export function PayrollManagement() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [department, setDepartment] = useState<string>("all")
  const [payrollStatus, setPayrollStatus] = useState<string>("all")

  const filteredPayroll =
    department === "all" && payrollStatus === "all"
      ? payrollData
      : payrollData.filter((record) => {
          const departmentMatch = department === "all" || record.department.toLowerCase() === department.toLowerCase()
          const statusMatch = payrollStatus === "all" || record.status.toLowerCase() === payrollStatus.toLowerCase()
          return departmentMatch && statusMatch
        })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payroll Management</h2>
          <p className="text-muted-foreground">Manage and process employee payroll.</p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMMM yyyy") : <span>Select month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" />
            Run Payroll
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$875,450.00</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 1.5%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 3
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$7,003.60</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 0.8%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payroll Status</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">In Progress</div>
            <p className="text-xs text-muted-foreground">Next payment: April 30, 2023</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Payroll</TabsTrigger>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
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
                  <SelectItem value="human resources">Human Resources</SelectItem>
                </SelectContent>
              </Select>
              <Select value={payrollStatus} onValueChange={setPayrollStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
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
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayroll.map((record) => (
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
                    <TableCell>{record.employeeId}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.position}</TableCell>
                    <TableCell>{record.salary}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          record.status === "Processed"
                            ? "border-green-500 text-green-500"
                            : "border-amber-500 text-amber-500"
                        }`}
                      >
                        {record.status}
                      </Badge>
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
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Payslip
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Email Payslip
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Payslip
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredPayroll.length}</strong> of <strong>{payrollData.length}</strong> employees
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search payroll periods..." />
            </div>
            <div className="flex items-center gap-2">
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
                  <TableHead>Period</TableHead>
                  <TableHead>Total Employees</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Processed Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.period}</TableCell>
                    <TableCell>{record.totalEmployees}</TableCell>
                    <TableCell>{record.totalAmount}</TableCell>
                    <TableCell>{new Date(record.processedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        {record.status}
                      </Badge>
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
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Report
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />
                            Print Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payroll Progress</CardTitle>
            <CardDescription>Current month payroll processing status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div className="text-sm font-medium">Data Collection</div>
                  </div>
                  <div className="text-sm font-medium">Completed</div>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div className="text-sm font-medium">Verification</div>
                  </div>
                  <div className="text-sm font-medium">Completed</div>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <div className="text-sm font-medium">Processing</div>
                  </div>
                  <div className="text-sm font-medium">In Progress</div>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-gray-400" />
                    <div className="text-sm font-medium">Disbursement</div>
                  </div>
                  <div className="text-sm font-medium">Pending</div>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium">Expected Completion</p>
                <p className="text-muted-foreground">April 30, 2023</p>
              </div>
              <Button variant="outline">View Details</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
            <CardDescription>Payroll distribution by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Engineering</div>
                  <div className="text-muted-foreground">$325,450.00 (37.2%)</div>
                </div>
                <Progress value={37.2} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Marketing</div>
                  <div className="text-muted-foreground">$185,200.00 (21.2%)</div>
                </div>
                <Progress value={21.2} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Finance</div>
                  <div className="text-muted-foreground">$156,800.00 (17.9%)</div>
                </div>
                <Progress value={17.9} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Human Resources</div>
                  <div className="text-muted-foreground">$98,500.00 (11.3%)</div>
                </div>
                <Progress value={11.3} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">Sales</div>
                  <div className="text-muted-foreground">$109,500.00 (12.4%)</div>
                </div>
                <Progress value={12.4} className="h-2" />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium">Total Payroll</p>
                <p className="text-muted-foreground">$875,450.00</p>
              </div>
              <Button variant="outline">View Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

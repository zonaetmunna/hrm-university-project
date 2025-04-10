/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, Download, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Mock attendance data for the current employee
const mockAttendanceData: AttendanceRecord[] = [
  {
    id: 1,
    date: "2023-04-10",
    checkIn: "09:02 AM",
    checkOut: "05:45 PM",
    status: "Present",
    workHours: "8h 43m",
  },
  {
    id: 2,
    date: "2023-04-11",
    checkIn: "08:55 AM",
    checkOut: "06:10 PM",
    status: "Present",
    workHours: "9h 15m",
  },
  {
    id: 3,
    date: "2023-04-12",
    checkIn: "09:30 AM",
    checkOut: "05:30 PM",
    status: "Present",
    workHours: "8h 00m",
  },
  {
    id: 4,
    date: "2023-04-13",
    checkIn: "10:15 AM",
    checkOut: "06:30 PM",
    status: "Late",
    workHours: "8h 15m",
  },
  {
    id: 5,
    date: "2023-04-14",
    checkIn: "--:--",
    checkOut: "--:--",
    status: "Absent",
    workHours: "0h 00m",
  },
  {
    id: 6,
    date: "2023-04-17",
    checkIn: "09:05 AM",
    checkOut: "05:50 PM",
    status: "Present",
    workHours: "8h 45m",
  },
  {
    id: 7,
    date: "2023-04-18",
    checkIn: "08:58 AM",
    checkOut: "06:05 PM",
    status: "Present",
    workHours: "9h 07m",
  },
]

// Mock summary data
const mockSummary = {
  currentMonth: {
    present: 18,
    late: 2,
    absent: 1,
    workingDays: 21,
    attendancePercentage: 95.2,
    averageWorkHours: "8h 35m",
  },
  previousMonth: {
    present: 20,
    late: 1,
    absent: 1,
    workingDays: 22,
    attendancePercentage: 95.5,
    averageWorkHours: "8h 42m",
  }
}

// Define the type for attendance records
interface AttendanceRecord {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string;
  status: string;
  workHours: string;
}

/**
 * EmployeeAttendance Component
 * 
 * Displays the attendance records and statistics for the current employee.
 * Allows filtering by date and month, and provides a monthly attendance summary.
 * 
 * @returns {JSX.Element} The employee attendance component
 */
export function EmployeeAttendance() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [month, setMonth] = useState<string>(format(new Date(), 'MMMM yyyy'))
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [summary, setSummary] = useState({
    currentMonth: {
      present: 0,
      late: 0,
      absent: 0,
      workingDays: 0,
      attendancePercentage: 0,
      averageWorkHours: "0h 0m"
    },
    previousMonth: {
      present: 0,
      late: 0,
      absent: 0,
      workingDays: 0,
      attendancePercentage: 0,
      averageWorkHours: "0h 0m"
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [todayRecord, setTodayRecord] = useState<any>(null)

  // Fetch attendance data from API
  useEffect(() => {
    fetchAttendance()
  }, [month])

  async function fetchAttendance() {
    try {
      setIsLoading(true)
      
      // For development fallback or testing
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setAttendanceData(mockAttendanceData);
        setSummary(mockSummary);
        setTodayRecord(null);
        setIsLoading(false);
        return;
      }
      
      // Extract year and month from the selected month string
      const monthParts = month.split(' ')
      const monthName = monthParts[0]
      const year = monthParts[1]
      
      // Convert month name to number (1-12)
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
      const monthNumber = monthNames.indexOf(monthName) + 1
      
      // Fetch attendance data for the selected month
      const response = await fetch(`/api/employee/attendance?month=${year}-${monthNumber.toString().padStart(2, '0')}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data")
      }
      
      const data = await response.json()
      
      // Format the attendance records for display
      const formattedAttendance = data.records.map((record: any) => ({
        id: record.id,
        date: format(new Date(record.date), 'yyyy-MM-dd'),
        checkIn: record.checkIn ? format(new Date(record.checkIn), 'hh:mm a') : '--:--',
        checkOut: record.checkOut ? format(new Date(record.checkOut), 'hh:mm a') : '--:--',
        status: record.status.charAt(0).toUpperCase() + record.status.slice(1), // Capitalize
        workHours: calculateWorkHours(record.checkIn, record.checkOut),
      })) as AttendanceRecord[]
      
      setAttendanceData(formattedAttendance)
      setSummary(data.summary)
      setTodayRecord(data.todayRecord)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
      toast.error("Failed to load attendance data")
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to calculate work hours
  function calculateWorkHours(checkIn: string | null, checkOut: string | null): string {
    if (!checkIn || !checkOut) return '0h 00m'
    
    const inTime = new Date(checkIn)
    const outTime = new Date(checkOut)
    const diffMs = outTime.getTime() - inTime.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${diffHrs}h ${diffMins.toString().padStart(2, '0')}m`
  }

  // Function to handle check-in for today
  const handleCheckIn = async () => {
    try {
      const response = await fetch('/api/employee/attendance', {
        method: 'POST',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to check in")
      }
      
      const data = await response.json()
      setTodayRecord(data)
      toast.success("Check-in recorded successfully!")
      await fetchAttendance() // Refresh attendance data
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to check in")
    }
  }

  // Function to handle check-out for today
  const handleCheckOut = async () => {
    try {
      const response = await fetch('/api/employee/attendance', {
        method: 'PUT',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to check out")
      }
      
      const data = await response.json()
      setTodayRecord(data)
      toast.success("Check-out recorded successfully!")
      await fetchAttendance() // Refresh attendance data
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to check out")
    }
  }

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    const currentDate = new Date(month)
    currentDate.setMonth(currentDate.getMonth() - 1)
    setMonth(format(currentDate, 'MMMM yyyy'))
  }

  // Function to navigate to next month
  const goToNextMonth = () => {
    const currentDate = new Date(month)
    currentDate.setMonth(currentDate.getMonth() + 1)
    setMonth(format(currentDate, 'MMMM yyyy'))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Attendance</h2>
        <p className="text-muted-foreground">View and manage your attendance records.</p>
      </div>

      {/* Today's attendance actions */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Attendance</CardTitle>
          <CardDescription>Record your check-in and check-out times</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Current Date</p>
              <p className="text-xl font-bold">{format(new Date(), 'PPP')}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Current Time</p>
              <p className="text-xl font-bold">{format(new Date(), 'p')}</p>
            </div>
            <div className="flex-1"></div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCheckIn} 
                disabled={!!todayRecord?.checkIn}
              >
                <Clock className="mr-2 h-4 w-4" />
                {todayRecord?.checkIn ? 'Checked In' : 'Check In'}
              </Button>
              <Button 
                onClick={handleCheckOut} 
                variant="outline"
                disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}
              >
                <Clock className="mr-2 h-4 w-4" />
                {todayRecord?.checkOut ? 'Checked Out' : 'Check Out'}
              </Button>
            </div>
          </div>
          {todayRecord && (
            <div className="mt-4 text-sm text-muted-foreground">
              {todayRecord.checkIn && (
                <p>
                  Check-in: {format(new Date(todayRecord.checkIn), 'hh:mm a')}
                  {' '} | Status: 
                  <span className={
                    todayRecord.status === 'present' ? 'text-green-500' : 
                    todayRecord.status === 'late' ? 'text-amber-500' : 'text-red-500'
                  }>
                    {' '}{todayRecord.status.charAt(0).toUpperCase() + todayRecord.status.slice(1)}
                  </span>
                </p>
              )}
              {todayRecord.checkOut && (
                <p>Check-out: {format(new Date(todayRecord.checkOut), 'hh:mm a')}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.currentMonth.attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <Progress value={summary.currentMonth.attendancePercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.currentMonth.present} / {summary.currentMonth.workingDays}
            </div>
            <p className="text-xs text-muted-foreground">Working days this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Days</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.currentMonth.late}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Work Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.currentMonth.averageWorkHours}</div>
            <p className="text-xs text-muted-foreground">Per working day</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>View and filter your attendance history</CardDescription>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="w-36 text-center">
                  <span className="text-sm font-medium">{month}</span>
                </div>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">Loading attendance records...</TableCell>
                  </TableRow>
                ) : attendanceData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">No attendance records found</TableCell>
                  </TableRow>
                ) : (
                  attendanceData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
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
                          <Badge
                            variant="outline"
                            className={
                              record?.status === "Present"
                                ? "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200"
                                : record.status === "Absent"
                                ? "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200"
                                : "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200"
                            }
                          >
                            {record.status}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Unit tests (in a real application, these would be in a separate file)
 * 
 * Tests for the EmployeeAttendance component functionality:
 * 
 * 1. Test that the component renders correctly with mock data
 * 2. Test that the check-in button triggers the expected function
 * 3. Test that the check-out button triggers the expected function
 * 4. Test that the month navigation works correctly
 * 5. Test that the loading state is properly displayed
 */ 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Attendance } from "@prisma/client"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

/**
 * GET /api/employee/attendance
 * 
 * Fetch attendance records for the authenticated employee.
 * Optional query parameters:
 * - month: YYYY-MM format to filter by month
 * 
 * @returns {Promise<NextResponse>} JSON response with attendance data
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get("month")

    const whereClause: any = { userId }

    // If month is specified, filter by month
    if (monthParam) {
      const [year, month] = monthParam.split("-").map(Number)
      
      if (!isNaN(year) && !isNaN(month)) {
        const startDate = new Date(year, month - 1, 1) // Month is 0-indexed in JS Date
        const endDate = new Date(year, month, 0) // Last day of the month
        
        whereClause.date = {
          gte: startDate,
          lte: endDate,
        }
      }
    }

    // Get attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: whereClause,
      orderBy: {
        date: "desc",
      },
    })

    // Calculate monthly statistics
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    
    const currentMonthRecords = attendanceRecords.filter(
      (record: Attendance) => 
        new Date(record.date) >= firstDayOfMonth && 
        new Date(record.date) <= lastDayOfMonth
    )
    
    const workingDaysInMonth = getWorkingDaysCount(firstDayOfMonth, lastDayOfMonth)
    const presentDays = currentMonthRecords.filter((record: { status: string }) => record.status === "present").length
    const lateDays = currentMonthRecords.filter((record: { status: string }) => record.status === "late").length
    const absentDays = currentMonthRecords.filter((record: { status: string }) => record.status === "absent").length
    
    const attendancePercentage = workingDaysInMonth > 0 
      ? ((presentDays + lateDays) / workingDaysInMonth) * 100 
      : 100

    // Calculate previous month statistics for comparison
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
    
    const firstDayOfPrevMonth = new Date(prevMonthYear, prevMonth, 1)
    const lastDayOfPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0)
    
    const prevMonthRecords = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: firstDayOfPrevMonth,
          lte: lastDayOfPrevMonth,
        },
      },
    })
    
    const workingDaysInPrevMonth = getWorkingDaysCount(firstDayOfPrevMonth, lastDayOfPrevMonth)
    const prevMonthPresentDays = prevMonthRecords.filter((record: { status: string }) => record.status === "present").length
    const prevMonthLateDays = prevMonthRecords.filter((record: { status: string }) => record.status === "late").length
    
    const prevMonthAttendancePercentage = workingDaysInPrevMonth > 0 
      ? ((prevMonthPresentDays + prevMonthLateDays) / workingDaysInPrevMonth) * 100 
      : 100

    // Check if there's a record for today
    const today8AM = new Date(today)
    today8AM.setHours(8, 0, 0, 0)
    
    const todayRecord = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today8AM,
          lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        },
      },
    })

    // Return all attendance data
    return NextResponse.json({
      records: attendanceRecords,
      summary: {
        currentMonth: {
          present: presentDays,
          late: lateDays,
          absent: absentDays,
          workingDays: workingDaysInMonth,
          attendancePercentage: parseFloat(attendancePercentage.toFixed(1)),
          // Calculate average work hours for days with both check-in and check-out
          averageWorkHours: calculateAverageWorkHours(currentMonthRecords)
        },
        previousMonth: {
          present: prevMonthPresentDays,
          late: prevMonthLateDays,
          absent: workingDaysInPrevMonth - prevMonthPresentDays - prevMonthLateDays,
          workingDays: workingDaysInPrevMonth,
          attendancePercentage: parseFloat(prevMonthAttendancePercentage.toFixed(1)),
          averageWorkHours: calculateAverageWorkHours(prevMonthRecords)
        }
      },
      todayRecord
    })
  } catch (error) {
    console.error("[EMPLOYEE_ATTENDANCE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

/**
 * POST /api/employee/attendance
 * 
 * Record check-in for the authenticated employee.
 * 
 * @returns {Promise<NextResponse>} JSON response with the created attendance record
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id
    const now = new Date()
    
    // Check if there's already an attendance record for today
    const today8AM = new Date(now)
    today8AM.setHours(8, 0, 0, 0)
    
    const existingRecord = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today8AM,
          lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        },
      },
    })

    if (existingRecord) {
      return new NextResponse("Attendance already recorded for today", { status: 400 })
    }

    // Determine status based on check-in time
    const standardStartTime = new Date(now)
    standardStartTime.setHours(9, 0, 0, 0) // 9:00 AM is standard start time
    
    const status = now > standardStartTime ? "late" : "present"

    // Create new attendance record
    const attendance = await prisma.attendance.create({
      data: {
        userId,
        date: now,
        checkIn: now,
        checkOut: null,
        status,
      },
    })

    return NextResponse.json(attendance)
  } catch (error) {
    console.error("[EMPLOYEE_ATTENDANCE_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

/**
 * PUT /api/employee/attendance
 * 
 * Record check-out for the authenticated employee.
 * 
 * @returns {Promise<NextResponse>} JSON response with the updated attendance record
 */
export async function PUT() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id
    const now = new Date()
    
    // Find today's attendance record
    const today8AM = new Date(now)
    today8AM.setHours(8, 0, 0, 0)
    
    const todayRecord = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today8AM,
          lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        },
      },
    })

    if (!todayRecord) {
      return new NextResponse("No check-in record found for today", { status: 400 })
    }

    if (todayRecord.checkOut) {
      return new NextResponse("Check-out already recorded for today", { status: 400 })
    }

    // Update the record with check-out time
    const updatedRecord = await prisma.attendance.update({
      where: { id: todayRecord.id },
      data: { checkOut: now },
    })

    return NextResponse.json(updatedRecord)
  } catch (error) {
    console.error("[EMPLOYEE_ATTENDANCE_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

/**
 * Helper function to calculate working days between two dates (excluding weekends)
 * 
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {number} Number of working days
 */
function getWorkingDaysCount(startDate: Date, endDate: Date): number {
  let count = 0
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Saturday or Sunday
      count++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return count
}

/**
 * Helper function to calculate average work hours from attendance records
 * 
 * @param {Attendance[]} records - Array of attendance records
 * @returns {string} Average work hours in format "Xh Ym"
 */
function calculateAverageWorkHours(records: Attendance[]): string {
  // Filter records that have both check-in and check-out
  const completeRecords = records.filter(record => record.checkIn && record.checkOut)
  
  if (completeRecords.length === 0) {
    return "0h 0m"
  }
  
  // Calculate total working minutes
  const totalMinutes = completeRecords.reduce((total, record) => {
    if (!record.checkIn || !record.checkOut) return total
    
    const checkIn = new Date(record.checkIn)
    const checkOut = new Date(record.checkOut)
    const diffMinutes = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60)
    
    return total + diffMinutes
  }, 0)
  
  const averageMinutes = totalMinutes / completeRecords.length
  const hours = Math.floor(averageMinutes / 60)
  const minutes = Math.round(averageMinutes % 60)
  
  return `${hours}h ${minutes}m`
} 
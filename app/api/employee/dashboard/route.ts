import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Attendance, Leave } from "@prisma/client"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id
    
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        department: true,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Get relevant data for dashboard
    const [leaves, attendances, payslips, goals, announcements] = await Promise.all([
      // Recent leave requests
      prisma.leave.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 3
      }),
      
      // Recent attendance records
      prisma.attendance.findMany({
        where: {
          userId,
        },
        orderBy: {
          date: "desc"
        },
        take: 30
      }),
      
      // Recent payslips
      prisma.payslip.findMany({
        where: {
          userId,
        },
        orderBy: [
          { year: "desc" },
          { month: "desc" }
        ],
        take: 3
      }),
      
      // Current goals
      prisma.goal.findMany({
        where: {
          userId,
          status: "in-progress"
        },
        orderBy: {
          deadline: "asc"
        },
        take: 3
      }),
      
      // Recent announcements
      prisma.announcement.findMany({
        orderBy: {
          createdAt: "desc"
        },
        take: 3,
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      })
    ])

    // Calculate attendance percentage for current month
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    
    const currentMonthAttendance = attendances.filter((a: Attendance) => 
      new Date(a.date) >= firstDayOfMonth && new Date(a.date) <= today
    )
    
    const workingDaysCount = getWorkingDaysCount(firstDayOfMonth, today)
    const presentDaysCount = currentMonthAttendance.filter((a: Attendance) => a.status === "present").length
    
    const attendancePercentage = workingDaysCount > 0 
      ? Math.round((presentDaysCount / workingDaysCount) * 100) 
      : 100

    // Calculate leave balance (mock implementation - should be based on company policy)
    const totalLeaveBalance = 20 // Annual leave allowance
    const usedLeaves = leaves.filter((l: Leave) => 
      l.status === "approved" && 
      new Date(l.startDate).getFullYear() === today.getFullYear()
    ).reduce((total: number, leave: Leave) => {
      const start = new Date(leave.startDate)
      const end = new Date(leave.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      return total + days
    }, 0)
    
    const remainingLeaves = totalLeaveBalance - usedLeaves

    // Format next payslip date
    const nextMonth = today.getMonth() === 11 ? 0 : today.getMonth() + 1
    const nextYear = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear()
    const lastDayOfNextMonth = new Date(nextYear, nextMonth + 1, 0)
    
    const nextPayslipDate = lastDayOfNextMonth.toISOString().split('T')[0]
    const daysToNextPayslip = Math.ceil((lastDayOfNextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Get documents
    const documents = await prisma.document.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 3
    })

    const dashboardData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department?.name || null
      },
      leaveBalance: {
        total: totalLeaveBalance,
        used: usedLeaves,
        remaining: remainingLeaves
      },
      attendance: {
        percentage: attendancePercentage,
        period: `${firstDayOfMonth.toLocaleDateString()} - ${today.toLocaleDateString()}`
      },
      nextPayslip: {
        date: nextPayslipDate,
        daysRemaining: daysToNextPayslip
      },
      unreadAnnouncements: announcements.length,
      recentLeaves: leaves,
      upcomingEvents: [
        {
          title: "Quarterly Review",
          type: "meeting",
          date: new Date(today.getFullYear(), today.getMonth() + 1, 15).toISOString(),
          time: "10:00 AM"
        },
        {
          title: "Team Building Event",
          type: "event",
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 20).toISOString(),
          time: "All Day"
        }
      ],
      goals,
      recentPayslips: payslips,
      documents
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("[EMPLOYEE_DASHBOARD_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// Helper function to calculate working days between two dates
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
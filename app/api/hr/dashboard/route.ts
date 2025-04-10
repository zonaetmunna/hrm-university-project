import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

/**
 * GET /api/hr/dashboard
 * 
 * Fetches dashboard data for HR personnel.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} Dashboard statistics and data
 */
export async function GET() {
  try {
    // Check for authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only HR or admin can access this endpoint
    if (session.user.role !== "hr" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get total employees count
    const totalEmployees = await prisma.user.count()
    
    // Get new employees this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const newEmployees = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    // Get pending leave requests
    const pendingLeaveRequests = await prisma.leave.count({
      where: {
        status: "pending"
      }
    })

    // Get attendance rate (mocked for now, would require more complex calculation in reality)
    // In a real implementation, this would calculate based on expected vs actual attendance
    const attendanceRate = 96.5

    // Get onboarding in progress (this is a mock since we don't have an onboarding model yet)
    // In a real implementation, this would come from the database
    const onboardingInProgress = 2

    // Get department distribution
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    })

    const departmentData = departments.map((dept: { id: string; name: string; _count: { users: number } }) => {
      const employeeCount = dept._count.users
      const percentage = totalEmployees > 0 ? Math.round((employeeCount / totalEmployees) * 1000) / 10 : 0
      
      return {
        id: dept.id,
        name: dept.name,
        employeeCount,
        percentage
      }
    })

    // Mock data for upcoming events
    // In a real implementation, these would come from a calendar/events table
    const upcomingEvents = [
      { 
        id: 1, 
        type: 'birthday', 
        title: 'John Smith\'s Birthday', 
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      { 
        id: 2, 
        type: 'event', 
        title: 'Company Town Hall', 
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      { 
        id: 3, 
        type: 'review', 
        title: 'Quarterly Performance Reviews', 
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      { 
        id: 4, 
        type: 'event', 
        title: 'New Employee Orientation', 
        date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Get leave statistics
    const totalLeaves = await prisma.leave.count({
      where: {
        startDate: {
          gte: startOfMonth
        }
      }
    })

    const approvedLeaves = await prisma.leave.count({
      where: {
        status: "approved",
        startDate: {
          gte: startOfMonth
        }
      }
    })

    const rejectedLeaves = await prisma.leave.count({
      where: {
        status: "rejected",
        startDate: {
          gte: startOfMonth
        }
      }
    })

    const leaveStats = {
      approved: approvedLeaves,
      approvedPercentage: totalLeaves > 0 ? Math.round((approvedLeaves / totalLeaves) * 100) : 0,
      pending: pendingLeaveRequests,
      pendingPercentage: totalLeaves > 0 ? Math.round((pendingLeaveRequests / totalLeaves) * 100) : 0,
      rejected: rejectedLeaves,
      rejectedPercentage: totalLeaves > 0 ? Math.round((rejectedLeaves / totalLeaves) * 100) : 0
    }

    // Mock payroll data
    // In a real implementation, this would be calculated from payslips
    const payroll = {
      totalAmount: 875450,
      employeeCount: totalEmployees,
      averageSalary: totalEmployees > 0 ? Math.round((875450 / totalEmployees) * 100) / 100 : 0,
      paymentDate: new Date(new Date().getFullYear(), new Date().getMonth(), 30).toISOString()
    }

    // Get recent activities
    // In a real implementation, this would come from an activity log table
    // For now, we'll mock this data
    const recentActivities = [
      {
        id: 1,
        userName: 'Sarah Johnson',
        userAvatar: '/placeholder.svg',
        userInitials: 'SJ',
        action: 'Approved leave request for Michael Brown',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        userName: 'David Wilson',
        userAvatar: '/placeholder.svg',
        userInitials: 'DW',
        action: 'Added new employee: Emma Thompson',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        userName: 'Sarah Johnson',
        userAvatar: '/placeholder.svg',
        userInitials: 'SJ',
        action: 'Generated payroll for current month',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        userName: 'Lisa Miller',
        userAvatar: '/placeholder.svg',
        userInitials: 'LM',
        action: 'Updated department structure',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Build the response data
    const dashboardData = {
      stats: {
        totalEmployees,
        newEmployees,
        pendingLeaveRequests,
        attendanceRate,
        onboardingInProgress
      },
      departments: departmentData,
      upcomingEvents,
      leaveStats,
      payroll,
      recentActivities
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching HR dashboard data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
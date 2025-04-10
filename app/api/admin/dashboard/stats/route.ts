import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

/**
 * GET /api/admin/dashboard/stats
 * 
 * Returns statistics for the admin dashboard.
 * Requires admin authentication.
 */
export async function GET() {
  try {
    // Check for admin authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get total users count
    const totalUsers = await prisma.user.count()
    
    // Get total departments count
    const totalDepartments = await prisma.department.count()
    
    // For the purpose of this example, we'll generate some dummy data
    // since we don't have actual leave or payroll tables yet
    const pendingLeaves = Math.floor(Math.random() * 30) + 5 // Random number between 5-35
    const totalPayroll = Math.floor(Math.random() * 1000000) + 500000 // Random between 500k-1.5M
    
    // For a real implementation, you would query actual data:
    // const pendingLeaves = await prisma.leaveRequest.count({
    //   where: { status: "pending" }
    // })
    
    return NextResponse.json({
      totalUsers,
      totalDepartments,
      pendingLeaves,
      totalPayroll
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
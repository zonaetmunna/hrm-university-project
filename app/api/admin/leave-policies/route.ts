import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

/**
 * GET /api/admin/leave-policies
 * 
 * Returns all leave policies.
 * Requires admin or HR authentication.
 */
export async function GET() {
  try {
    // Check for authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admin or HR can access leave policies
    if (session.user.role !== "admin" && session.user.role !== "hr") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // In a real implementation, fetch from database
    // For now, return mock data
    const leavePolicies = [
      {
        id: "1",
        name: "Annual Leave",
        daysPerYear: 24,
        carryOverLimit: 5,
        minimumTenure: 0,
        description: "Standard annual leave for all employees",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Sick Leave",
        daysPerYear: 10,
        carryOverLimit: 0,
        minimumTenure: 0,
        description: "Sick leave with medical certificate required for 3+ consecutive days",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Parental Leave",
        daysPerYear: 90,
        carryOverLimit: 0,
        minimumTenure: 12,
        description: "Maternity/Paternity leave for new parents",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "4",
        name: "Bereavement Leave",
        daysPerYear: 5,
        carryOverLimit: 0,
        minimumTenure: 0,
        description: "Leave following the death of an immediate family member",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "5",
        name: "Marriage Leave",
        daysPerYear: 5,
        carryOverLimit: 0,
        minimumTenure: 6,
        description: "Leave for employee's own marriage",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    return NextResponse.json(leavePolicies)
  } catch (error) {
    console.error("Error fetching leave policies:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/leave-policies
 * 
 * Creates a new leave policy.
 * Requires admin authentication.
 */
export async function POST(request: Request) {
  try {
    // Check for authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, daysPerYear, carryOverLimit, minimumTenure, description } = body

    if (!name || !daysPerYear) {
      return NextResponse.json(
        { error: "Name and days per year are required" },
        { status: 400 }
      )
    }

    // Create ID - in a real implementation this would be done by the database
    const id = Date.now().toString();
    
    // Mock creation - in a real implementation, this would save to database
    const leavePolicy = {
      id,
      name,
      daysPerYear,
      carryOverLimit: carryOverLimit || 0,
      minimumTenure: minimumTenure || 0,
      description: description || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(
      { leavePolicy, message: "Leave policy created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating leave policy:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
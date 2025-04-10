import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

/**
 * GET /api/admin/salary-structures
 * 
 * Returns all salary structures.
 * Requires admin or HR authentication.
 */
export async function GET() {
  try {
    // Check for authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admin or HR can access salary structures
    if (session.user.role !== "admin" && session.user.role !== "hr") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // In a real implementation, fetch from database
    // For now, return mock data
    const salaryStructures = [
      {
        id: "1",
        name: "Junior Engineer",
        baseSalary: 60000,
        maxSalary: 90000,
        bonusPercentage: 5,
        paymentFrequency: "monthly",
        allowances: ["Transport", "Internet"],
        departmentId: "1", // Engineering
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Senior Engineer",
        baseSalary: 90000,
        maxSalary: 150000,
        bonusPercentage: 10,
        paymentFrequency: "monthly",
        allowances: ["Transport", "Internet", "Housing"],
        departmentId: "1", // Engineering
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Marketing Executive",
        baseSalary: 55000,
        maxSalary: 85000,
        bonusPercentage: 8,
        paymentFrequency: "monthly",
        allowances: ["Transport", "Phone"],
        departmentId: "2", // Marketing
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "4",
        name: "Sales Representative",
        baseSalary: 50000,
        maxSalary: 100000,
        bonusPercentage: 15,
        paymentFrequency: "monthly",
        allowances: ["Transport", "Phone"],
        departmentId: "3", // Sales
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "5",
        name: "Finance Manager",
        baseSalary: 100000,
        maxSalary: 180000,
        bonusPercentage: 12,
        paymentFrequency: "monthly",
        allowances: ["Transport", "Housing", "Entertainment"],
        departmentId: "4", // Finance
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    return NextResponse.json(salaryStructures)
  } catch (error) {
    console.error("Error fetching salary structures:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/salary-structures
 * 
 * Creates a new salary structure.
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
    const { name, baseSalary, maxSalary, bonusPercentage, paymentFrequency, allowances, departmentId } = body

    if (!name || !baseSalary || !departmentId) {
      return NextResponse.json(
        { error: "Name, base salary, and department ID are required" },
        { status: 400 }
      )
    }

    // Create ID - in a real implementation this would be done by the database
    const id = Date.now().toString();
    
    // Mock creation - in a real implementation, this would save to database
    const salaryStructure = {
      id,
      name,
      baseSalary,
      maxSalary: maxSalary || baseSalary,
      bonusPercentage: bonusPercentage || 0,
      paymentFrequency: paymentFrequency || "monthly",
      allowances: allowances || [],
      departmentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(
      { salaryStructure, message: "Salary structure created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating salary structure:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
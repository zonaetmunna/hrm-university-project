/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

/**
 * GET /api/admin/departments
 * 
 * Returns all departments.
 * Requires admin authentication.
 */
export async function GET() {
  try {
    // Check for admin authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "admin" && session.user.role !== "hr") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all departments
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    })

    // Map departments to add employee count
    const departmentsWithEmployeeCount = departments.map((dept: { id: any; name: any; description: any; _count: { users: any } }) => ({
      id: dept.id,
      name: dept.name,
      description: dept.description,
      employeeCount: dept._count.users
    }))
    
    return NextResponse.json(departmentsWithEmployeeCount)
  } catch (error) {
    console.error("Error fetching departments:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/departments
 * 
 * Creates a new department.
 * Requires admin authentication.
 */
export async function POST(request: Request) {
  try {
    // Check for admin authentication
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      )
    }

    // Check if department with the same name already exists
    const existingDepartment = await prisma.department.findFirst({
      where: { name }
    })

    if (existingDepartment) {
      return NextResponse.json(
        { error: "Department with this name already exists" },
        { status: 400 }
      )
    }

    // Create the department
    const department = await prisma.department.create({
      data: {
        name,
        description: description || null
      }
    })
    
    return NextResponse.json(
      { department, message: "Department created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating department:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
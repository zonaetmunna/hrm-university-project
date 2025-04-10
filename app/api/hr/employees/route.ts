import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

// Employee filter schema
const employeeFilterSchema = z.object({
  department: z.string().optional(),
  role: z.string().optional(),
  search: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
})

/**
 * GET /api/hr/employees
 * 
 * Fetches all employees with filtering options.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} List of employees
 */
export async function GET(request: Request) {
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

    // Parse URL and query parameters
    const url = new URL(request.url)
    const searchParams = Object.fromEntries(url.searchParams.entries())
    
    // Default values
    const defaultPage = 1
    const defaultLimit = 10
    
    // Validate query parameters
    const validationResult = employeeFilterSchema.safeParse(searchParams)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    // Extract parameters
    const { department, role, search, page = defaultPage, limit = defaultLimit } = validationResult.data
    
    // Build the where clause for filtering
    const where: any = {} 
    
    if (department) {
      where.departmentId = department
    }
    
    if (role) {
      where.role = role
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Get total count for pagination
    const totalEmployees = await prisma.user.count({ where })
    
    // Calculate pagination values
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(totalEmployees / limit)
    
    // Fetch employees
    const employees = await prisma.user.findMany({
      where,
      include: {
        department: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        position: true,
        avatar: true,
        createdAt: true,
        department: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      },
      skip,
      take: limit
    })
    
    // Add employee initials for avatar fallback
    const employeesWithInitials = employees.map((employee) => {
      const initials = employee.name
        ? employee.name
            .split(' ')
            .map((part: string) => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('')
        : ''
      
      return {
        ...employee,
        initials
      }
    })
    
    // Construct response with pagination data
    const response = {
      employees: employeesWithInitials,
      pagination: {
        total: totalEmployees,
        page,
        limit,
        totalPages
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/hr/employees
 * 
 * Creates a new employee.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} Created employee
 */
export async function POST(request: Request) {
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

    // Parse request body
    const body = await request.json()
    
    // Validate body schema (simplified for example purposes)
    const employeeSchema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      role: z.enum(["admin", "hr", "team-lead", "employee"]).default("employee"),
      position: z.string().min(2, "Position must be at least 2 characters"),
      departmentId: z.string().optional()
    })
    
    const validationResult = employeeSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid employee data", details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { name, email, password, role, position, departmentId } = validationResult.data
    
    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }
    
    // Check if department exists if departmentId is provided
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: departmentId }
      })
      
      if (!department) {
        return NextResponse.json(
          { error: "Department not found" },
          { status: 404 }
        )
      }
    }
    
    // Create the user
    // Note: In a real implementation, the password would be hashed
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In real app, this would be hashed
        role,
        position,
        ...(departmentId && { departmentId })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        position: true,
        departmentId: true,
        createdAt: true
      }
    })
    
    return NextResponse.json(
      { 
        employee: user, 
        message: "Employee created successfully" 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

// Payroll filter schema
const payrollFilterSchema = z.object({
  userId: z.string().optional(),
  department: z.string().optional(),
  month: z.string().transform(val => parseInt(val, 10)).optional(),
  year: z.string().transform(val => parseInt(val, 10)).optional(),
  status: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
})

// Payslip schema for validation
const payslipSchema = z.object({
  userId: z.string(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000).max(2100),
  basicSalary: z.number().min(0),
  allowances: z.number().min(0),
  deductions: z.number().min(0),
  status: z.enum(["pending", "approved", "paid"]).default("pending")
})

/**
 * GET /api/hr/payroll
 * 
 * Fetches payslips with filtering options.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} List of payslips
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
    
    // Default values - current month and year if not specified
    const currentDate = new Date()
    const defaultPage = 1
    const defaultLimit = 20
    const defaultMonth = currentDate.getMonth() + 1 // JavaScript months are 0-indexed
    const defaultYear = currentDate.getFullYear()
    
    // Validate query parameters
    const validationResult = payrollFilterSchema.safeParse(searchParams)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    // Extract parameters
    const { 
      userId, 
      department, 
      month = defaultMonth, 
      year = defaultYear,
      status,
      page = defaultPage, 
      limit = defaultLimit 
    } = validationResult.data
    
    // Build the where clause for filtering
    const where: any = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (department) {
      where.user = {
        departmentId: department
      }
    }
    
    if (month) {
      where.month = month
    }
    
    if (year) {
      where.year = year
    }
    
    if (status) {
      where.status = status
    }
    
    // Get total count for pagination
    const totalRecords = await prisma.payslip.count({ where })
    
    // Calculate pagination values
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(totalRecords / limit)
    
    // Fetch payslips
    const payslips = await prisma.payslip.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
            avatar: true,
            department: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ],
      skip,
      take: limit
    })
    
    // Process data for frontend
    const formattedPayslips = payslips.map(payslip => {
      // Add initials for avatar fallback
      const initials = payslip.user.name
        ? payslip.user.name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('')
        : ''
      
      // Format month name for display
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
      const monthName = monthNames[payslip.month - 1]
      
      return {
        ...payslip,
        monthName,
        periodLabel: `${monthName} ${payslip.year}`,
        user: {
          ...payslip.user,
          initials
        }
      }
    })
    
    // Calculate summary statistics
    const totalAmount = formattedPayslips.reduce((sum, payslip) => sum + payslip.netSalary, 0)
    const averageSalary = formattedPayslips.length ? totalAmount / formattedPayslips.length : 0
    
    // Construct response with pagination data and summary
    const response = {
      payslips: formattedPayslips,
      summary: {
        totalAmount,
        averageSalary,
        employeeCount: formattedPayslips.length,
        month,
        year
      },
      pagination: {
        total: totalRecords,
        page,
        limit,
        totalPages
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching payroll data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/hr/payroll
 * 
 * Creates a new payslip.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} Created payslip
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
    
    // Validate body
    const validationResult = payslipSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid payslip data", details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { userId, month, year, basicSalary, allowances, deductions, status } = validationResult.data
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Check if payslip for this month and year already exists for this user
    const existingPayslip = await prisma.payslip.findFirst({
      where: {
        userId,
        month,
        year
      }
    })
    
    if (existingPayslip) {
      return NextResponse.json(
        { error: "Payslip already exists for this month and year" },
        { status: 409 }
      )
    }
    
    // Calculate net salary
    const netSalary = basicSalary + allowances - deductions
    
    // Create the payslip
    const payslip = await prisma.payslip.create({
      data: {
        userId,
        month,
        year,
        basicSalary,
        allowances,
        deductions,
        netSalary,
        status
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            position: true
          }
        }
      }
    })
    
    return NextResponse.json(
      { 
        payslip, 
        message: "Payslip created successfully" 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating payslip:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/hr/payroll
 * 
 * Updates a payslip's status or details.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} Updated payslip
 */
export async function PUT(request: Request) {
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
    
    // Validate the payslip ID
    if (!body.id) {
      return NextResponse.json(
        { error: "Payslip ID is required" },
        { status: 400 }
      )
    }
    
    // Check if the payslip exists
    const existingPayslip = await prisma.payslip.findUnique({
      where: { id: body.id }
    })
    
    if (!existingPayslip) {
      return NextResponse.json(
        { error: "Payslip not found" },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const updateData: any = {}
    
    // We'll only allow updating certain fields
    if (body.basicSalary !== undefined) {
      updateData.basicSalary = body.basicSalary
    }
    
    if (body.allowances !== undefined) {
      updateData.allowances = body.allowances
    }
    
    if (body.deductions !== undefined) {
      updateData.deductions = body.deductions
    }
    
    if (body.status !== undefined) {
      // Validate status
      if (!["pending", "approved", "paid"].includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status. Must be one of: pending, approved, paid" },
          { status: 400 }
        )
      }
      updateData.status = body.status
    }
    
    // Recalculate net salary if any component has changed
    if (updateData.basicSalary !== undefined || 
        updateData.allowances !== undefined || 
        updateData.deductions !== undefined) {
      
      const basicSalary = updateData.basicSalary !== undefined 
        ? updateData.basicSalary 
        : existingPayslip.basicSalary
        
      const allowances = updateData.allowances !== undefined 
        ? updateData.allowances 
        : existingPayslip.allowances
        
      const deductions = updateData.deductions !== undefined 
        ? updateData.deductions 
        : existingPayslip.deductions
      
      updateData.netSalary = basicSalary + allowances - deductions
    }
    
    // Update the payslip
    const updatedPayslip = await prisma.payslip.update({
      where: { id: body.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true
          }
        }
      }
    })
    
    // Prepare response message based on status
    let message = "Payslip updated successfully"
    
    if (body.status === "approved") {
      message = "Payslip has been approved"
    } else if (body.status === "paid") {
      message = "Payslip has been marked as paid"
    }
    
    return NextResponse.json({
      payslip: updatedPayslip,
      message
    })
  } catch (error) {
    console.error("Error updating payslip:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
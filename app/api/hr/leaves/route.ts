import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

// Leave filter schema
const leaveFilterSchema = z.object({
  userId: z.string().optional(),
  department: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
})

// Leave request schema for validation
const leaveRequestSchema = z.object({
  userId: z.string(),
  type: z.string().min(1, "Leave type is required"),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid start date format",
  }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid end date format",
  }),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  status: z.enum(["pending", "approved", "rejected"]).default("pending")
})

/**
 * GET /api/hr/leaves
 * 
 * Fetches leave requests with filtering options.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} List of leave requests
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
    const defaultLimit = 20
    
    // Validate query parameters
    const validationResult = leaveFilterSchema.safeParse(searchParams)
    
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
      status,
      type,
      startDate, 
      endDate, 
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
    
    if (status) {
      where.status = status
    }
    
    if (type) {
      where.type = type
    }
    
    if (startDate || endDate) {
      if (startDate) {
        where.startDate = {
          gte: new Date(startDate)
        }
      }
      
      if (endDate) {
        where.endDate = {
          lte: new Date(endDate)
        }
      }
    }
    
    // Get total count for pagination
    const totalRecords = await prisma.leave.count({ where })
    
    // Calculate pagination values
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(totalRecords / limit)
    
    // Fetch leave records
    const leaveRecords = await prisma.leave.findMany({
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
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    })
    
    // Process data for frontend
    const formattedRecords = leaveRecords.map(record => {
      // Add initials for avatar fallback
      const initials = record.user.name
        ? record.user.name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('')
        : ''
      
      // Calculate leave duration in days
      const startDate = new Date(record.startDate)
      const endDate = new Date(record.endDate)
      const durationInMs = endDate.getTime() - startDate.getTime()
      const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24)) + 1 // +1 to include end date
      
      return {
        ...record,
        durationInDays,
        user: {
          ...record.user,
          initials
        }
      }
    })
    
    // Construct response with pagination data
    const response = {
      leaveRecords: formattedRecords,
      pagination: {
        total: totalRecords,
        page,
        limit,
        totalPages
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching leave records:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/hr/leaves
 * 
 * Creates a new leave request on behalf of an employee.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} Created leave request
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
    const validationResult = leaveRequestSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid leave request data", details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { userId, type, startDate, endDate, reason, status } = validationResult.data
    
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
    
    // Check date validity
    const parsedStartDate = new Date(startDate)
    const parsedEndDate = new Date(endDate)
    
    if (parsedStartDate > parsedEndDate) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      )
    }
    
    // Check for overlapping leave requests
    const overlappingLeave = await prisma.leave.findFirst({
      where: {
        userId,
        OR: [
          {
            startDate: {
              lte: parsedEndDate
            },
            endDate: {
              gte: parsedStartDate
            }
          }
        ]
      }
    })
    
    if (overlappingLeave) {
      return NextResponse.json(
        { error: "User already has an overlapping leave request for this period" },
        { status: 409 }
      )
    }
    
    // Create the leave request
    const leaveRequest = await prisma.leave.create({
      data: {
        userId,
        type,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        reason,
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
        leave: leaveRequest, 
        message: "Leave request created successfully" 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating leave request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/hr/leaves
 * 
 * Updates the status of a leave request (approve/reject).
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} Updated leave request
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
    
    // Validate the leave ID and status
    if (!body.id) {
      return NextResponse.json(
        { error: "Leave request ID is required" },
        { status: 400 }
      )
    }
    
    if (!body.status || !["pending", "approved", "rejected"].includes(body.status)) {
      return NextResponse.json(
        { error: "Valid status is required (pending, approved, or rejected)" },
        { status: 400 }
      )
    }
    
    // Check if the leave request exists
    const existingRequest = await prisma.leave.findUnique({
      where: { id: body.id }
    })
    
    if (!existingRequest) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      )
    }
    
    // Update the leave request status
    const updatedRequest = await prisma.leave.update({
      where: { id: body.id },
      data: { 
        status: body.status,
        ...(body.comment && { comment: body.comment })
      },
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
    let message = "Leave request updated successfully"
    
    if (body.status === "approved") {
      message = "Leave request has been approved"
    } else if (body.status === "rejected") {
      message = "Leave request has been rejected"
    }
    
    return NextResponse.json({
      leave: updatedRequest,
      message
    })
  } catch (error) {
    console.error("Error updating leave request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

// Attendance filter schema
const attendanceFilterSchema = z.object({
  userId: z.string().optional(),
  department: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
})

// Attendance entry schema for validation
const attendanceEntrySchema = z.object({
  userId: z.string(),
  date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  checkIn: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid check-in time format",
  }).optional(),
  checkOut: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid check-out time format",
  }).optional(),
  status: z.enum(["present", "absent", "late", "half-day", "work-from-home"]).default("present")
})

/**
 * GET /api/hr/attendance
 * 
 * Fetches attendance records with filtering options.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} List of attendance records
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
    const validationResult = attendanceFilterSchema.safeParse(searchParams)
    
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
      startDate, 
      endDate, 
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
    
    if (startDate || endDate) {
      where.date = {}
      
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      
      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }
    
    if (status) {
      where.status = status
    }
    
    // Get total count for pagination
    const totalRecords = await prisma.attendance.count({ where })
    
    // Calculate pagination values
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(totalRecords / limit)
    
    // Fetch attendance records
    const attendanceRecords = await prisma.attendance.findMany({
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
        { date: 'desc' },
        { checkIn: 'desc' }
      ],
      skip,
      take: limit
    })
    
    // Process data for frontend
    const formattedRecords = attendanceRecords.map(record => {
      // Add initials for avatar fallback
      const initials = record.user.name
        ? record.user.name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('')
        : ''
      
      return {
        ...record,
        user: {
          ...record.user,
          initials
        }
      }
    })
    
    // Construct response with pagination data
    const response = {
      attendanceRecords: formattedRecords,
      pagination: {
        total: totalRecords,
        page,
        limit,
        totalPages
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching attendance records:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/hr/attendance
 * 
 * Creates a new attendance record.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} Created attendance record
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
    const validationResult = attendanceEntrySchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid attendance data", details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { userId, date, checkIn, checkOut, status } = validationResult.data
    
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
    
    // Check if attendance record already exists for this date and user
    const existingRecord = await prisma.attendance.findFirst({
      where: {
        userId,
        date: new Date(date)
      }
    })
    
    if (existingRecord) {
      return NextResponse.json(
        { error: "Attendance record already exists for this date" },
        { status: 409 }
      )
    }
    
    // Create the attendance record
    const attendanceRecord = await prisma.attendance.create({
      data: {
        userId,
        date: new Date(date),
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
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
        attendance: attendanceRecord, 
        message: "Attendance record created successfully" 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating attendance record:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/hr/attendance
 * 
 * Updates an existing attendance record.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} Updated attendance record
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
    
    // Validate the attendance ID
    if (!body.id) {
      return NextResponse.json(
        { error: "Attendance ID is required" },
        { status: 400 }
      )
    }
    
    // Check if the attendance record exists
    const existingRecord = await prisma.attendance.findUnique({
      where: { id: body.id }
    })
    
    if (!existingRecord) {
      return NextResponse.json(
        { error: "Attendance record not found" },
        { status: 404 }
      )
    }
    
    // Validate update data
    const updateSchema = z.object({
      id: z.string(),
      checkIn: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid check-in time format",
      }).optional(),
      checkOut: z.string().refine(val => !isNaN(Date.parse(val)), {
        message: "Invalid check-out time format",
      }).optional(),
      status: z.enum(["present", "absent", "late", "half-day", "work-from-home"]).optional()
    })
    
    const validationResult = updateSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid update data", details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { id, checkIn, checkOut, status } = validationResult.data
    
    // Prepare update data
    const updateData: any = {}
    
    if (checkIn !== undefined) {
      updateData.checkIn = checkIn ? new Date(checkIn) : null
    }
    
    if (checkOut !== undefined) {
      updateData.checkOut = checkOut ? new Date(checkOut) : null
    }
    
    if (status !== undefined) {
      updateData.status = status
    }
    
    // Update the attendance record
    const updatedRecord = await prisma.attendance.update({
      where: { id },
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
    
    return NextResponse.json({
      attendance: updatedRecord,
      message: "Attendance record updated successfully"
    })
  } catch (error) {
    console.error("Error updating attendance record:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
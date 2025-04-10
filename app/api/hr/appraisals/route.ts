import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

// Appraisal filter schema
const appraisalFilterSchema = z.object({
  userId: z.string().optional(),
  department: z.string().optional(),
  giverId: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
})

// Appraisal schema for validation
const appraisalSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  type: z.string().min(1, "Type is required"),
  status: z.enum(["Draft", "Submitted", "Completed", "Archived"]).default("Draft"),
  giverId: z.string(),
  receiverId: z.string(),
  dueDate: z.string().optional().refine(val => val ? !isNaN(Date.parse(val)) : true, {
    message: "Invalid date format",
  }),
  metrics: z.array(
    z.object({
      name: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().optional()
    })
  ).optional()
})

/**
 * GET /api/hr/appraisals
 * 
 * Fetches appraisals with filtering options.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} List of appraisals
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
    const validationResult = appraisalFilterSchema.safeParse(searchParams)
    
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
      giverId,
      status,
      type,
      page = defaultPage, 
      limit = defaultLimit 
    } = validationResult.data
    
    // Build the where clause for filtering
    const where: any = {}
    
    if (userId) {
      // If userId is specified, we show appraisals where this user is the receiver
      where.receiverId = userId
    }
    
    if (giverId) {
      where.giverId = giverId
    }
    
    if (department) {
      where.receiver = {
        departmentId: department
      }
    }
    
    if (status) {
      where.status = status
    }
    
    if (type) {
      where.type = type
    }
    
    // Get total count for pagination
    const totalRecords = await prisma.feedback.count({ where })
    
    // Calculate pagination values
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(totalRecords / limit)
    
    // Fetch appraisals
    const appraisals = await prisma.feedback.findMany({
      where,
      include: {
        giver: {
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
        },
        receiver: {
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
    const formattedAppraisals = appraisals.map(appraisal => {
      // Add initials for avatar fallback
      const giverInitials = appraisal.giver.name
        ? appraisal.giver.name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('')
        : ''
        
      const receiverInitials = appraisal.receiver.name
        ? appraisal.receiver.name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('')
        : ''
      
      return {
        ...appraisal,
        giver: {
          ...appraisal.giver,
          initials: giverInitials
        },
        receiver: {
          ...appraisal.receiver,
          initials: receiverInitials
        }
      }
    })
    
    // Group appraisals by status
    const statusCounts = {
      Draft: 0,
      Submitted: 0,
      Completed: 0,
      Archived: 0
    }
    
    formattedAppraisals.forEach(a => {
      statusCounts[a.status as keyof typeof statusCounts]++
    })
    
    // Construct response with pagination data
    const response = {
      appraisals: formattedAppraisals,
      stats: {
        statusCounts,
        total: totalRecords
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
    console.error("Error fetching appraisals:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/hr/appraisals
 * 
 * Creates a new appraisal.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} Created appraisal
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
    const validationResult = appraisalSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid appraisal data", details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { title, content, type, status, giverId, receiverId, dueDate, metrics } = validationResult.data
    
    // Check if giver exists
    const giver = await prisma.user.findUnique({
      where: { id: giverId }
    })
    
    if (!giver) {
      return NextResponse.json(
        { error: "Giver not found" },
        { status: 404 }
      )
    }
    
    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })
    
    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      )
    }
    
    // Create the appraisal
    const appraisal = await prisma.feedback.create({
      data: {
        title,
        content,
        type,
        status,
        giverId,
        receiverId,
        dueDate: dueDate ? new Date(dueDate) : undefined
      },
      include: {
        giver: {
          select: {
            name: true,
            email: true,
            position: true
          }
        },
        receiver: {
          select: {
            name: true,
            email: true,
            position: true
          }
        }
      }
    })
    
    // In a full implementation, you would also handle the metrics
    // This might be in a separate table with a relation to the feedback
    
    return NextResponse.json(
      { 
        appraisal, 
        message: "Appraisal created successfully" 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating appraisal:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/hr/appraisals
 * 
 * Updates an appraisal's status or content.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} Updated appraisal
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
    
    // Validate the appraisal ID
    if (!body.id) {
      return NextResponse.json(
        { error: "Appraisal ID is required" },
        { status: 400 }
      )
    }
    
    // Check if the appraisal exists
    const existingAppraisal = await prisma.feedback.findUnique({
      where: { id: body.id }
    })
    
    if (!existingAppraisal) {
      return NextResponse.json(
        { error: "Appraisal not found" },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const updateData: any = {}
    
    // We'll only allow updating certain fields
    if (body.title !== undefined) {
      updateData.title = body.title
    }
    
    if (body.content !== undefined) {
      updateData.content = body.content
    }
    
    if (body.status !== undefined) {
      // Validate status
      if (!["Draft", "Submitted", "Completed", "Archived"].includes(body.status)) {
        return NextResponse.json(
          { error: "Invalid status. Must be one of: Draft, Submitted, Completed, Archived" },
          { status: 400 }
        )
      }
      updateData.status = body.status
    }
    
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null
    }
    
    // Update the appraisal
    const updatedAppraisal = await prisma.feedback.update({
      where: { id: body.id },
      data: updateData,
      include: {
        giver: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true
          }
        },
        receiver: {
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
    let message = "Appraisal updated successfully"
    
    if (body.status === "Completed") {
      message = "Appraisal has been completed"
    } else if (body.status === "Archived") {
      message = "Appraisal has been archived"
    }
    
    return NextResponse.json({
      appraisal: updatedAppraisal,
      message
    })
  } catch (error) {
    console.error("Error updating appraisal:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
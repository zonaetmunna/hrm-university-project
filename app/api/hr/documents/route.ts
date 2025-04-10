import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

// Document filter schema
const documentFilterSchema = z.object({
  userId: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.string().transform(val => parseInt(val, 10)).optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
})

// Document schema for validation
const documentSchema = z.object({
  name: z.string().min(1, "Document name is required"),
  category: z.string().min(1, "Category is required"),
  userId: z.string(),
  size: z.string(),
  url: z.string().url("Invalid URL format"),
})

/**
 * GET /api/hr/documents
 * 
 * Fetches documents with filtering options.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} List of documents
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
    const validationResult = documentFilterSchema.safeParse(searchParams)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    // Extract parameters
    const { 
      userId, 
      category, 
      search,
      page = defaultPage, 
      limit = defaultLimit 
    } = validationResult.data
    
    // Build the where clause for filtering
    const where: any = {}
    
    if (userId) {
      where.userId = userId
    }
    
    if (category) {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Get total count for pagination
    const totalRecords = await prisma.document.count({ where })
    
    // Calculate pagination values
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(totalRecords / limit)
    
    // Fetch documents
    const documents = await prisma.document.findMany({
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
        { dateUploaded: 'desc' }
      ],
      skip,
      take: limit
    })
    
    // Process data for frontend
    const formattedDocuments = documents.map(doc => {
      // Add initials for avatar fallback
      const initials = doc.user.name
        ? doc.user.name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('')
        : ''
      
      return {
        ...doc,
        user: {
          ...doc.user,
          initials
        }
      }
    })
    
    // Construct response with pagination data
    const response = {
      documents: formattedDocuments,
      pagination: {
        total: totalRecords,
        page,
        limit,
        totalPages
      }
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/hr/documents
 * 
 * Creates a new document record.
 * Requires HR or admin authentication.
 * 
 * Note: This API endpoint only handles the document metadata.
 * Actual file uploads would typically be handled via a separate 
 * mechanism (e.g., S3 direct uploads, separate upload endpoint)
 * 
 * @returns {Promise<NextResponse>} Created document record
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
    const validationResult = documentSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid document data", details: validationResult.error.errors },
        { status: 400 }
      )
    }
    
    const { name, category, userId, size, url } = validationResult.data
    
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
    
    // Create the document record
    const document = await prisma.document.create({
      data: {
        name,
        category,
        userId,
        size,
        url,
        uploadedBy: session.user.name || "HR Admin",
        dateUploaded: new Date()
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
        document, 
        message: "Document record created successfully" 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating document record:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/hr/documents
 * 
 * Deletes a document record.
 * Requires HR or admin authentication.
 * 
 * Note: Actual file deletion from storage would need to be handled separately
 * 
 * @returns {Promise<NextResponse>} Deletion confirmation
 */
export async function DELETE(request: Request) {
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

    // Parse URL for document ID
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      )
    }
    
    // Check if the document exists
    const document = await prisma.document.findUnique({
      where: { id }
    })
    
    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      )
    }
    
    // Delete the document record
    await prisma.document.delete({
      where: { id }
    })
    
    return NextResponse.json({
      message: "Document deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting document:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
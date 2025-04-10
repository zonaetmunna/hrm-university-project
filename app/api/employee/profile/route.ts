import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

/**
 * GET /api/employee/profile
 * 
 * Fetch profile data for the authenticated employee.
 * 
 * @returns {Promise<NextResponse>} JSON response with profile data
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id

    // Get user profile with department
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        department: true,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Get additional information like education and experience (mock data for now)
    // In a real app, these would be separate models related to the user
    const education = [
      {
        id: 1,
        degree: "Master of Computer Science",
        institution: "Stanford University",
        year: "2015-2019",
      },
      {
        id: 2,
        degree: "Bachelor of Engineering",
        institution: "MIT",
        year: "2011-2015",
      },
    ]

    const experience = [
      {
        id: 1,
        position: "Senior Developer",
        company: "Current Company",
        duration: "2020 - Present",
      },
      {
        id: 2,
        position: "Software Engineer",
        company: "Previous Company",
        duration: "2015 - 2020",
      },
    ]

    const skills = ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "Docker"]

    // Get documents related to the user
    const documents = await prisma.document.findMany({
      where: {
        userId,
      },
      orderBy: {
        dateUploaded: "desc",
      },
    })

    // Format the response
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "/placeholder.svg",
      initials: user.name ? getInitials(user.name) : "NA",
      position: user.position,
      department: user.department?.name,
      departmentId: user.departmentId,
      phone: user.phone || null, // This field doesn't exist in the schema but we'll include it
      address: user.address || null, // This field doesn't exist in the schema but we'll include it
      joinDate: user.createdAt,
      status: "Active",
      education,
      experience,
      skills,
      documents: documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.category,
        size: doc.size,
        date: doc.dateUploaded,
        url: doc.url,
      })),
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[EMPLOYEE_PROFILE_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

/**
 * PUT /api/employee/profile
 * 
 * Update profile data for the authenticated employee.
 * 
 * @param {Request} request - The request object with profile data
 * @returns {Promise<NextResponse>} JSON response with updated profile
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()

    // Validate the request body
    const profileSchema = z.object({
      name: z.string().optional(),
      position: z.string().optional(),
      phone: z.string().optional(),
      address: z.string().optional(),
      avatar: z.string().optional(),
      bio: z.string().optional(),
    })

    const validationResult = profileSchema.safeParse(body)

    if (!validationResult.success) {
      return new NextResponse(JSON.stringify(validationResult.error), { status: 400 })
    }

    // Get only the fields we want to update
    const updatedData = validationResult.data

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updatedData,
    })

    // Format the response (simplified for brevity)
    const profile = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar || "/placeholder.svg",
      initials: updatedUser.name ? getInitials(updatedUser.name) : "NA",
      position: updatedUser.position,
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("[EMPLOYEE_PROFILE_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

/**
 * Helper function to get the initials from a name
 * 
 * @param {string} name - The full name
 * @returns {string} The initials (up to 2 characters)
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
} 
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import * as z from "zod"

/**
 * Onboarding status schema
 */
export const onboardingSchema = z.object({
  employeeId: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  departmentId: z.string(),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  status: z.enum(["Not Started", "In Progress", "Completed"]).default("Not Started"),
  progress: z.number().min(0).max(100).default(0),
  stage: z.string().default("Pending"),
  checklistItems: z.array(
    z.object({
      id: z.number().optional(),
      title: z.string(),
      completed: z.boolean().default(false)
    })
  ).optional()
})

/**
 * GET /api/hr/onboarding
 * 
 * Fetches all employees in the onboarding process.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} List of employees in onboarding
 */
export async function GET() {
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

    // In a real implementation, we would fetch from a dedicated onboarding table
    // For now, we'll return mock data - in the future this should be properly implemented
    // with a proper database model

    // Mock onboarding employees data
    const onboardingEmployees = [
      {
        id: 1,
        name: "Michael Wilson",
        position: "Senior Developer",
        department: "Engineering",
        departmentId: "1",
        startDate: "2023-04-15",
        avatar: "/placeholder.svg",
        initials: "MW",
        status: "In Progress",
        progress: 65,
        stage: "Documentation",
        email: "michael.wilson@example.com"
      },
      {
        id: 2,
        name: "Emily Davis",
        position: "Marketing Specialist",
        department: "Marketing",
        departmentId: "2",
        startDate: "2023-04-18",
        avatar: "/placeholder.svg",
        initials: "ED",
        status: "In Progress",
        progress: 40,
        stage: "IT Setup",
        email: "emily.davis@example.com"
      },
      {
        id: 3,
        name: "Alex Thompson",
        position: "Product Manager",
        department: "Product",
        departmentId: "3",
        startDate: "2023-04-22",
        avatar: "/placeholder.svg",
        initials: "AT",
        status: "Not Started",
        progress: 0,
        stage: "Pending",
        email: "alex.thompson@example.com"
      },
      {
        id: 4,
        name: "Sarah Lee",
        position: "HR Specialist",
        department: "Human Resources",
        departmentId: "4",
        startDate: "2023-04-25",
        avatar: "/placeholder.svg",
        initials: "SL",
        status: "Not Started",
        progress: 0,
        stage: "Pending",
        email: "sarah.lee@example.com"
      },
      {
        id: 5,
        name: "James Rodriguez",
        position: "Financial Analyst",
        department: "Finance",
        departmentId: "5",
        startDate: "2023-04-10",
        avatar: "/placeholder.svg",
        initials: "JR",
        status: "Completed",
        progress: 100,
        stage: "Completed",
        email: "james.rodriguez@example.com"
      }
    ]

    return NextResponse.json(onboardingEmployees)
  } catch (error) {
    console.error("Error fetching onboarding employees:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/hr/onboarding
 * 
 * Creates a new employee onboarding record.
 * Requires HR or admin authentication.
 * 
 * @returns {Promise<NextResponse>} Created onboarding record
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "hr" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    
    // Validate request body
    const validationResult = onboardingSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { name, email, position, departmentId, startDate, checklistItems } = validationResult.data
    
    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    })

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      )
    }

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

    // In a real implementation, we would create an onboarding record in the database
    // For now, we'll simulate a successful creation and return mock data

    // Default checklist items if none provided
    const defaultChecklistItems = [
      { id: 1, title: "Personal Information", completed: false },
      { id: 2, title: "Employment Details", completed: false },
      { id: 3, title: "Documentation", completed: false },
      { id: 4, title: "IT Setup", completed: false },
      { id: 5, title: "Training", completed: false },
      { id: 6, title: "Department Introduction", completed: false },
      { id: 7, title: "First Week Schedule", completed: false }
    ]

    // Mock new onboarding record
    const newOnboardingEmployee = {
      id: Date.now(),
      name,
      email,
      position,
      departmentId,
      department: department.name,
      startDate,
      avatar: "/placeholder.svg",
      initials: getInitials(name),
      status: "Not Started",
      progress: 0,
      stage: "Pending",
      checklistItems: checklistItems || defaultChecklistItems
    }

    return NextResponse.json(
      { 
        onboarding: newOnboardingEmployee, 
        message: "Onboarding process initiated successfully" 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating onboarding record:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * Helper function to get initials from a name
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
} 
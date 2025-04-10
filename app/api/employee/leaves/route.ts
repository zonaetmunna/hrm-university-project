import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

/**
 * GET /api/employee/leaves
 * 
 * Fetch leave requests for the authenticated employee.
 * 
 * @returns {Promise<NextResponse>} JSON response with leave data
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id

    // Get all leave requests for the user
    const leaves = await prisma.leave.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get leave balances (in a real app, this would be calculated based on company policy)
    const leaveBalances = {
      annual: {
        total: 30,
        used: 10,
        remaining: 20
      },
      sick: {
        total: 15,
        used: 3,
        remaining: 12
      },
      personal: {
        total: 5,
        used: 0,
        remaining: 5
      }
    }

    return NextResponse.json({
      leaves,
      balances: leaveBalances
    })
  } catch (error) {
    console.error("[EMPLOYEE_LEAVES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

/**
 * POST /api/employee/leaves
 * 
 * Create a new leave request for the authenticated employee.
 * 
 * @param {Request} request - The request object with leave details
 * @returns {Promise<NextResponse>} JSON response with the created leave
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()

    // Validate the request body
    const leaveSchema = z.object({
      type: z.string(),
      startDate: z.string().refine(value => !isNaN(Date.parse(value)), {
        message: "Invalid start date format",
      }),
      endDate: z.string().refine(value => !isNaN(Date.parse(value)), {
        message: "Invalid end date format",
      }),
      reason: z.string().min(5),
    })

    const validationResult = leaveSchema.safeParse(body)

    if (!validationResult.success) {
      return new NextResponse(JSON.stringify(validationResult.error), { status: 400 })
    }

    const { type, startDate, endDate, reason } = validationResult.data

    // Create the leave request
    const leave = await prisma.leave.create({
      data: {
        userId,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
        status: "pending" // All new requests start as pending
      },
    })

    return NextResponse.json(leave)
  } catch (error) {
    console.error("[EMPLOYEE_LEAVES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
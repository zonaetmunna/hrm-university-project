import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"
import * as z from "zod"

// Validation schema for user registration
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["admin", "hr", "team-lead", "employee"]).default("employee"),
  departmentId: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.errors },
        { status: 400 }
      )
    }

    const { name, email, password, role, departmentId } = result.data

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userExists) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        ...(departmentId && { departmentId }),
      },
    })

    // Return a sanitized user object (without the password)
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    return NextResponse.json(
      { user: sanitizedUser, message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Error registering user" },
      { status: 500 }
    )
  }
} 
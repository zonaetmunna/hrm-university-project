import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      )
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify the password
    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create a sanitized user object (without the password)
    const sanitizedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    // Set the user cookie
    const response = NextResponse.json({ user: sanitizedUser }, { status: 200 })
    
    // Set the cookie with the user data for the middleware
    response.cookies.set({
      name: "currentUser",
      value: JSON.stringify(sanitizedUser),
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,
      sameSite: "strict",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
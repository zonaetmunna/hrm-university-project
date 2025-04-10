import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

// GET single user
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// UPDATE user
export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId
    const body = await request.json()
    const { name, email, password, role, departmentId } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if email is being changed and if it's already in use
    if (email !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (emailInUse) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 }
        )
      }
    }

    // Prepare update data
    const updateData: {
      name: string;
      email: string;
      role: string;
      password?: string;
      departmentId?: string | null;
    } = {
      name,
      email,
      role,
    }

    // Only update password if provided
    if (password) {
      updateData.password = await hash(password, 10)
    }

    // Handle departmentId (can be null)
    if (departmentId === null || departmentId === undefined) {
      updateData.departmentId = null
    } else if (departmentId) {
      updateData.departmentId = departmentId
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        departmentId: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE user
export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 
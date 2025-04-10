/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * GET /api/employee/announcements
 * 
 * Retrieves announcements based on user role.
 * All users can view announcements, but may have different filtering options.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be signed in to access this endpoint" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const isImportant = searchParams.get('important') === 'true';
    
    // Build the where condition based on filters
    const whereCondition: any = {};
    
    if (category) {
      whereCondition.category = category;
    }
    
    if (isImportant) {
      whereCondition.isImportant = true;
    }

    // Get announcements with filters
    const announcements = await prisma.announcement.findMany({
      where: whereCondition,
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Error fetching announcements" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/employee/announcements
 * 
 * Creates a new announcement. Only available to users with admin or HR roles.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be signed in to access this endpoint" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Only allow admin and HR roles to create announcements
    if (user.role !== "admin" && user.role !== "hr") {
      return NextResponse.json(
        { error: "You do not have permission to create announcements" },
        { status: 403 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.content || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, category" },
        { status: 400 }
      );
    }

    // Create the announcement
    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        date: new Date(),
        author: data.author || user.name || user.email,
        category: data.category,
        isImportant: data.isImportant || false,
        userId: user.id,
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return NextResponse.json(
      { error: "Error creating announcement" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/employee/announcements
 * 
 * Deletes an announcement by ID. Only available to the creator, HR, or admin users.
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be signed in to access this endpoint" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const announcementId = searchParams.get('id');
    
    if (!announcementId) {
      return NextResponse.json(
        { error: "Announcement ID is required" },
        { status: 400 }
      );
    }

    // Check if announcement exists
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
    });

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    // Verify permission to delete
    if (announcement.userId !== user.id && user.role !== "admin" && user.role !== "hr") {
      return NextResponse.json(
        { error: "You do not have permission to delete this announcement" },
        { status: 403 }
      );
    }

    // Delete the announcement
    await prisma.announcement.delete({
      where: { id: announcementId },
    });

    return NextResponse.json(
      { message: "Announcement deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return NextResponse.json(
      { error: "Error deleting announcement" },
      { status: 500 }
    );
  }
} 
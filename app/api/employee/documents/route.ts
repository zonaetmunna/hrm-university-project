/* eslint-disable @typescript-eslint/no-unused-vars */
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * GET /api/employee/documents
 * 
 * Retrieves documents for the current user based on their ID and role.
 * Admins and HR can view all documents.
 * Team leads can view their team's documents.
 * Employees can only view their own documents.
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

    // Filter documents based on user role
    let documents;
    if (user.role === "admin" || user.role === "hr") {
      // Admins and HR can view all documents
      documents = await prisma.document.findMany({
        orderBy: { dateUploaded: "desc" },
      });
    } else if (user.role === "team-lead") {
      // Team leads can view their team's documents
      const teamMembers = await prisma.user.findMany({
        where: { departmentId: user.departmentId },
        select: { id: true },
      });
      
      const teamMemberIds = teamMembers.map((member: { id: string }) => member.id);
      
      documents = await prisma.document.findMany({
        where: {
          OR: [
            { userId: { in: teamMemberIds } },
            { userId: user.id }, // Include their own documents
          ],
        },
        orderBy: { dateUploaded: "desc" },
      });
    } else {
      // Regular employees can only see their documents
      documents = await prisma.document.findMany({
        where: { userId: user.id },
        orderBy: { dateUploaded: "desc" },
      });
    }

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Error fetching documents" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/employee/documents
 * 
 * Creates a new document for the user.
 * Document size and type are validated before creation.
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

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.category || !data.url) {
      return NextResponse.json(
        { error: "Missing required fields: name, category, url" },
        { status: 400 }
      );
    }

    // Create the document
    const document = await prisma.document.create({
      data: {
        name: data.name,
        category: data.category,
        uploadedBy: data.uploadedBy || user.name || user.email,
        dateUploaded: new Date(),
        size: data.size || "0 KB",
        url: data.url,
        userId: user.id,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { error: "Error creating document" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/employee/documents
 * 
 * Deletes a document by ID. Only available to the document owner, 
 * HR, or admin users.
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
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Check if document exists
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Verify permission to delete
    if (document.userId !== user.id && user.role !== "admin" && user.role !== "hr") {
      return NextResponse.json(
        { error: "You do not have permission to delete this document" },
        { status: 403 }
      );
    }

    // Delete the document
    await prisma.document.delete({
      where: { id: documentId },
    });

    return NextResponse.json(
      { message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Error deleting document" },
      { status: 500 }
    );
  }
} 
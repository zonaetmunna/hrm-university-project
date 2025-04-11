import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Add new interfaces for type safety
interface TicketWhereCondition {
  status?: string;
  department?: string;
  creatorId?: string;
  assignedId?: string;
  OR?: Array<{
    department?: string;
    creatorId?: string;
    assignedId?: string;
  }>;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  department: string;
  status: string;
  priority: string;
  creatorId: string;
  assignedId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TicketData {
  id?: string;
  title?: string;
  description?: string;
  department?: string;
  status?: string;
  priority?: string;
  assignedId?: string;
  message?: string;
}

/**
 * GET /api/employee/support
 * 
 * Retrieves support tickets based on user role and query parameters.
 * - Employees can only see their own tickets
 * - Department staff can see tickets assigned to their department
 * - Admins/HR can see all tickets
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
    const status = searchParams.get('status');
    const ticketId = searchParams.get('id');
    const department = searchParams.get('department');
    
    // If a specific ticket ID is requested
    if (ticketId) {
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: ticketId },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          messages: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      
      if (!ticket) {
        return NextResponse.json(
          { error: "Ticket not found" },
          { status: 404 }
        );
      }
      
      // Check if user has permission to view this ticket
      if (ticket.creatorId !== user.id && 
          ticket.assignedId !== user.id && 
          user.role !== 'admin' && 
          user.role !== 'hr' && 
          user.departmentId?.toLowerCase() !== ticket.department.toLowerCase()) {
        return NextResponse.json(
          { error: "You do not have permission to view this ticket" },
          { status: 403 }
        );
      }
      
      return NextResponse.json(ticket);
    }
    
    // Build the where condition based on filters and user role
    let whereCondition: TicketWhereCondition = {};
    
    // Apply status filter if provided
    if (status) {
      whereCondition.status = status;
    }
    
    // Apply department filter if provided
    if (department) {
      whereCondition.department = department;
    }
    
    // Filter by user role
    if (user.role === 'admin' || user.role === 'hr') {
      // Admin and HR can see all tickets
    } else if (user.departmentId) {
      // Department staff can see tickets assigned to their department
      // Or tickets created by them
      whereCondition = {
        ...whereCondition,
        OR: [
          { department: user.departmentId },
          { creatorId: user.id },
          { assignedId: user.id },
        ],
      };
    } else {
      // Regular employees can only see their own tickets
      whereCondition.creatorId = user.id;
    }

    // Get tickets with filters
    const tickets = await prisma.supportTicket.findMany({
      where: whereCondition,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Get counts for dashboard stats
    const activeTickets = tickets.filter((ticket: Ticket) => ticket.status !== 'Resolved').length;
    const resolvedTickets = tickets.filter((ticket: Ticket) => ticket.status === 'Resolved').length;

    return NextResponse.json({
      tickets,
      stats: {
        activeTickets,
        resolvedTickets,
        totalTickets: tickets.length,
      },
    });
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return NextResponse.json(
      { error: "Error fetching support tickets" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/employee/support
 * 
 * Creates a new support ticket.
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

    const data = await request.json() as TicketData;

    // Validate required fields
    if (!data.title || !data.description || !data.department) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, department" },
        { status: 400 }
      );
    }

    // Create the support ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        title: data.title,
        description: data.description,
        department: data.department,
        status: data.status || "Pending",
        priority: data.priority || "Normal",
        creatorId: user.id,
        // If assignee is provided and user is admin/HR
        assignedId: data.assignedId && (user.role === 'admin' || user.role === 'hr') 
          ? data.assignedId 
          : undefined,
      },
    });

    // If a message is included, add it to the ticket
    if (data.message) {
      await prisma.ticketMessage.create({
        data: {
          content: data.message,
          userId: user.id,
          ticketId: ticket.id,
        },
      });
    }

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return NextResponse.json(
      { error: "Error creating support ticket" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/employee/support
 * 
 * Updates an existing support ticket (status, assignee, etc.)
 * Or adds a reply to an existing ticket.
 */
export async function PUT(request: NextRequest) {
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

    const data = await request.json() as TicketData;

    if (!data.id) {
      return NextResponse.json(
        { error: "Ticket ID is required" },
        { status: 400 }
      );
    }

    // Check if ticket exists
    const existingTicket = await prisma.supportTicket.findUnique({
      where: { id: data.id },
    });

    if (!existingTicket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Check if user has permission to update this ticket
    const canUpdateTicket = user.role === 'admin' || 
                           user.role === 'hr' || 
                           existingTicket.creatorId === user.id || 
                           existingTicket.assignedId === user.id || 
                           user.departmentId?.toLowerCase() === existingTicket.department.toLowerCase();
    
    if (!canUpdateTicket) {
      return NextResponse.json(
        { error: "You do not have permission to update this ticket" },
        { status: 403 }
      );
    }

    // Handle adding a message/reply to the ticket
    if (data.message) {
      await prisma.ticketMessage.create({
        data: {
          content: data.message,
          userId: user.id,
          ticketId: data.id,
        },
      });
    }

    // Handle updating ticket properties
    const updateData: Partial<Ticket> = {};
    
    // Only staff can update these fields
    if (user.role === 'admin' || user.role === 'hr' || existingTicket.assignedId === user.id) {
      if (data.status !== undefined) {
        updateData.status = data.status;
      }
      
      if (data.priority !== undefined) {
        updateData.priority = data.priority;
      }
      
      if (data.assignedId !== undefined) {
        updateData.assignedId = data.assignedId;
      }
    }
    
    // If update data is not empty, update the ticket
    if (Object.keys(updateData).length > 0) {
      await prisma.supportTicket.update({
        where: { id: data.id },
        data: updateData,
      });
    }

    // Get the updated ticket with messages
    const updatedTicket = await prisma.supportTicket.findUnique({
      where: { id: data.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        messages: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Error updating support ticket:", error);
    return NextResponse.json(
      { error: "Error updating support ticket" },
      { status: 500 }
    );
  }
} 
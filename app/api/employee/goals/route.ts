/* eslint-disable @typescript-eslint/no-explicit-any */
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * GET /api/employee/goals
 * 
 * Retrieves goals for the current user.
 * For team leads, can also retrieve goals of their team members.
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
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    
    // Build the where condition based on filters
    const whereCondition: any = {};
    
    // If looking for specific user's goals (team leads can view their team's goals)
    if (userId && (user.role === 'admin' || user.role === 'hr' || user.role === 'team-lead')) {
      // Team leads can only view their team's goals
      if (user.role === 'team-lead') {
        const teamMembers = await prisma.user.findMany({
          where: { departmentId: user.departmentId },
          select: { id: true },
        });
        
        const teamMemberIds = teamMembers.map((member: { id: string }) => member.id);
        
        // Only allow if the requested user is in the team lead's team
        if (!teamMemberIds.includes(userId)) {
          return NextResponse.json(
            { error: "You do not have permission to view this user's goals" },
            { status: 403 }
          );
        }
        
        whereCondition.userId = userId;
      } else {
        // Admin or HR can view any user's goals
        whereCondition.userId = userId;
      }
    } else {
      // Default to viewing the current user's goals
      whereCondition.userId = user.id;
    }
    
    // Apply category filter if provided
    if (category) {
      whereCondition.category = category;
    }
    
    // Apply status filter if provided
    if (status) {
      whereCondition.status = status;
    }

    // Get goals with filters
    const goals = await prisma.goal.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });

    // Calculate statistics if viewing own goals
    if (!userId || userId === user.id) {
      const totalGoals = goals.length;
      const completedGoals = goals.filter((goal: any) => goal.status === 'Completed').length;
      const inProgressGoals = goals.filter((goal: any) => goal.status === 'In Progress').length;
      
      const overallProgress = totalGoals > 0
        ? Math.round(goals.reduce((acc: number, goal: any) => acc + goal.progress, 0) / totalGoals)
        : 0;
      
      return NextResponse.json({
        goals,
        stats: {
          totalGoals,
          completedGoals,
          inProgressGoals,
          overallProgress
        }
      });
    }

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json(
      { error: "Error fetching goals" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/employee/goals
 * 
 * Creates a new goal for the current user.
 * Team leads, HR, and admins can also create goals for other users.
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
    if (!data.title || !data.description || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, category" },
        { status: 400 }
      );
    }

    // Determine the user ID for which the goal is being created
    let targetUserId = user.id;
    
    // Allow team leads, HR, and admins to create goals for other users
    if (data.userId && (user.role === 'admin' || user.role === 'hr' || user.role === 'team-lead')) {
      // Team leads can only create goals for their team
      if (user.role === 'team-lead') {
        const teamMembers = await prisma.user.findMany({
          where: { departmentId: user.departmentId },
          select: { id: true },
        });
        
        const teamMemberIds = teamMembers.map((member: { id: string }) => member.id);
        
        // Only allow if the target user is in the team lead's team
        if (!teamMemberIds.includes(data.userId)) {
          return NextResponse.json(
            { error: "You do not have permission to create goals for this user" },
            { status: 403 }
          );
        }
      }
      
      targetUserId = data.userId;
    }

    // Create the goal
    const goal = await prisma.goal.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        target: data.target || null,
        progress: data.progress || 0,
        status: data.status || "In Progress",
        userId: targetUserId,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Error creating goal" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/employee/goals
 * 
 * Updates an existing goal. Users can only update their own goals
 * unless they are a team lead, HR, or admin.
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

    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: "Goal ID is required" },
        { status: 400 }
      );
    }

    // Check if goal exists
    const existingGoal = await prisma.goal.findUnique({
      where: { id: data.id },
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: "Goal not found" },
        { status: 404 }
      );
    }

    // Check permissions to update this goal
    if (existingGoal.userId !== user.id && 
        user.role !== 'admin' && 
        user.role !== 'hr') {
      
      // Team leads can only update goals of their team members
      if (user.role === 'team-lead') {
        const teamMembers = await prisma.user.findMany({
          where: { departmentId: user.departmentId },
          select: { id: true },
        });
        
        const teamMemberIds = teamMembers.map((member: { id: string }) => member.id);
        
        if (!teamMemberIds.includes(existingGoal.userId)) {
          return NextResponse.json(
            { error: "You do not have permission to update this goal" },
            { status: 403 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "You do not have permission to update this goal" },
          { status: 403 }
        );
      }
    }

    // Update the goal
    const updatedGoal = await prisma.goal.update({
      where: { id: data.id },
      data: {
        title: data.title !== undefined ? data.title : existingGoal.title,
        description: data.description !== undefined ? data.description : existingGoal.description,
        category: data.category !== undefined ? data.category : existingGoal.category,
        target: data.target !== undefined ? data.target : existingGoal.target,
        progress: data.progress !== undefined ? data.progress : existingGoal.progress,
        status: data.status !== undefined ? data.status : existingGoal.status,
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json(
      { error: "Error updating goal" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/employee/goals
 * 
 * Deletes a goal by ID. Users can only delete their own goals
 * unless they are a team lead, HR, or admin.
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
    const goalId = searchParams.get('id');
    
    if (!goalId) {
      return NextResponse.json(
        { error: "Goal ID is required" },
        { status: 400 }
      );
    }

    // Check if goal exists
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Goal not found" },
        { status: 404 }
      );
    }

    // Check permissions to delete this goal
    if (goal.userId !== user.id && 
        user.role !== 'admin' && 
        user.role !== 'hr') {
      
      // Team leads can only delete goals of their team members
      if (user.role === 'team-lead') {
        const teamMembers = await prisma.user.findMany({
          where: { departmentId: user.departmentId },
          select: { id: true },
        });
        
        const teamMemberIds = teamMembers.map((member: { id: string }) => member.id);
        
        if (!teamMemberIds.includes(goal.userId)) {
          return NextResponse.json(
            { error: "You do not have permission to delete this goal" },
            { status: 403 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "You do not have permission to delete this goal" },
          { status: 403 }
        );
      }
    }

    // Delete the goal
    await prisma.goal.delete({
      where: { id: goalId },
    });

    return NextResponse.json(
      { message: "Goal deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json(
      { error: "Error deleting goal" },
      { status: 500 }
    );
  }
} 
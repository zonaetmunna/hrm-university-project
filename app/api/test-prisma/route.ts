import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/test-prisma
 * 
 * A simple API endpoint to test Prisma connectivity
 */
export async function GET() {
  try {
    // Get some counts from the database
    const userCount = await prisma.user.count();
    const departmentCount = await prisma.department.count();
    const ticketCount = await prisma.supportTicket.count();
    
    return NextResponse.json({
      success: true,
      database: "Connected",
      counts: {
        users: userCount,
        departments: departmentCount,
        supportTickets: ticketCount
      }
    });
  } catch (error: any) {
    console.error("Prisma test error:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message || "An unknown error occurred",
      code: error.code || "UNKNOWN_ERROR"
    }, { status: 500 });
  }
} 
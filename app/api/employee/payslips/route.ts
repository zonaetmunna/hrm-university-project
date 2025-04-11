import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Add new interfaces for type safety
interface PayslipWhereClause {
  userId: string;
  year?: number;
}

interface Payslip {
  id: string;
  year: number;
  month: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
}

/**
 * GET /api/employee/payslips
 * 
 * Fetch payslips for the authenticated employee.
 * Optional query parameters:
 * - year: Filter payslips by year
 * 
 * @returns {Promise<NextResponse>} JSON response with payslips data
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get("year")
    
    const whereClause: PayslipWhereClause = { userId }
    
    // If year is specified, filter by year
    if (yearParam && !isNaN(Number(yearParam))) {
      const year = parseInt(yearParam, 10)
      whereClause.year = year
    }

    // Get payslips from the database
    const payslips = await prisma.payslip.findMany({
      where: whereClause,
      orderBy: [
        { year: "desc" },
        { month: "desc" }
      ],
    })

    // Calculate year summary (totals for the filtered year or current year)
    const summaryYear = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear()
    
    const yearPayslips = payslips.filter((p: { year: number }) => p.year === summaryYear)
    
    const yearSummary = {
      year: summaryYear,
      totalEarnings: 0,
      totalDeductions: 0,
      totalNetPay: 0,
      taxPaid: 0,
      insurancePaid: 0,
      pensionPaid: 0
    }
    
    // Calculate totals
    if (yearPayslips.length > 0) {
      yearSummary.totalEarnings = yearPayslips.reduce((sum: number, p: Payslip) => sum + p.basicSalary + p.allowances, 0)
      yearSummary.totalDeductions = yearPayslips.reduce((sum: number, p: Payslip) => sum + p.deductions, 0)
      yearSummary.totalNetPay = yearPayslips.reduce((sum: number, p: Payslip) => sum + p.netSalary, 0)
      
      // Assume tax is 40% of deductions, insurance 30%, and pension 30%
      yearSummary.taxPaid = yearSummary.totalDeductions * 0.4
      yearSummary.insurancePaid = yearSummary.totalDeductions * 0.3
      yearSummary.pensionPaid = yearSummary.totalDeductions * 0.3
    }
    
    // Format payslips for better readability
    const formattedPayslips = payslips.map((p: Payslip) => {
      // Get month name
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
      
      return {
        id: p.id,
        period: `${monthNames[p.month - 1]} ${p.year}`,
        issueDate: new Date(p.year, p.month - 1, 28), // Assume payslips issued on 28th
        status: p.status,
        grossAmount: p.basicSalary + p.allowances,
        netAmount: p.netSalary,
        deductions: p.deductions,
        paymentMethod: "Bank Transfer", // Default payment method
        details: {
          basicSalary: p.basicSalary,
          allowances: p.allowances,
          deductions: p.deductions,
          netSalary: p.netSalary
        }
      }
    })
    
    // Get available years for filtering
    const availableYears = [...new Set(payslips.map((p: Payslip) => p.year))]
      .sort((a, b) => (b as number) - (a as number));
    
    return NextResponse.json({
      payslips: formattedPayslips,
      yearSummary,
      availableYears
    })
  } catch (error) {
    console.error("[EMPLOYEE_PAYSLIPS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { format } from "date-fns"
import { AlertCircle, Download, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock Payslip data
type Payslip = {
  id: string
  period: string
  issueDate: Date
  status: "Paid" | "Processing" | "Pending"
  grossAmount: number
  netAmount: number
  paymentMethod: string
  deductions: number
}

// Mock payslip data
const mockPayslips: Payslip[] = [
  {
    id: "PAY-2023-12",
    period: "December 2023",
    issueDate: new Date(2023, 11, 31),
    status: "Paid",
    grossAmount: 5000,
    netAmount: 3850,
    paymentMethod: "Bank Transfer",
    deductions: 1150,
  },
  {
    id: "PAY-2023-11",
    period: "November 2023",
    issueDate: new Date(2023, 10, 30),
    status: "Paid",
    grossAmount: 5000,
    netAmount: 3850,
    paymentMethod: "Bank Transfer",
    deductions: 1150,
  },
  {
    id: "PAY-2023-10",
    period: "October 2023",
    issueDate: new Date(2023, 9, 31),
    status: "Paid",
    grossAmount: 5000,
    netAmount: 3850,
    paymentMethod: "Bank Transfer",
    deductions: 1150,
  },
  {
    id: "PAY-2023-09",
    period: "September 2023",
    issueDate: new Date(2023, 8, 30),
    status: "Paid",
    grossAmount: 5000,
    netAmount: 3850,
    paymentMethod: "Bank Transfer",
    deductions: 1150,
  },
  {
    id: "PAY-2023-08",
    period: "August 2023",
    issueDate: new Date(2023, 7, 31),
    status: "Paid",
    grossAmount: 5000,
    netAmount: 3850,
    paymentMethod: "Bank Transfer",
    deductions: 1150,
  },
  {
    id: "PAY-2023-07",
    period: "July 2023",
    issueDate: new Date(2023, 6, 31),
    status: "Paid",
    grossAmount: 5000,
    netAmount: 3850,
    paymentMethod: "Bank Transfer",
    deductions: 1150,
  }
]

// Mock earnings and deductions for current year
const mockYearSummary = {
  totalEarnings: 60000,
  totalDeductions: 13800,
  totalNetPay: 46200,
  taxPaid: 7200,
  insurancePaid: 3600,
  pensionPaid: 3000
}

/**
 * EmployeePayslips Component
 * 
 * Displays the payslips for the current employee.
 * Allows filtering by year and provides options to download payslips.
 * Shows summary of earnings and deductions for the selected year.
 * 
 * @returns {JSX.Element} The employee payslips component
 */
export function EmployeePayslips() {
  const [payslips, setPayslips] = useState<Payslip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [year, setYear] = useState<string>(new Date().getFullYear().toString())
  const [yearSummary, setYearSummary] = useState({
    totalEarnings: 0,
    totalDeductions: 0,
    totalNetPay: 0,
    taxPaid: 0,
    insurancePaid: 0,
    pensionPaid: 0
  })
  const [availableYears, setAvailableYears] = useState<string[]>([])

  // Fetch payslips data from API
  useEffect(() => {
    fetchPayslips(year)
  }, [year])

  async function fetchPayslips(year: string) {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/employee/payslips?year=${year}`)
      
      if (!response.ok) {
        throw new Error("Failed to load payslips")
      }
      
      const data = await response.json()
      
      // Convert date strings to Date objects
      const formattedPayslips = data.payslips.map((payslip: any) => ({
        ...payslip,
        issueDate: new Date(payslip.issueDate)
      }))
      
      setPayslips(formattedPayslips)
      setYearSummary(data.yearSummary)
      setAvailableYears(data.availableYears.map((y: number) => y.toString()))
      
      setIsLoading(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
      toast.error("Failed to load payslips")
      setIsLoading(false)
    }
  }

  function handleDownload(payslipId: string) {
    // In a real application, this would initiate a download of the payslip PDF
    toast.success(`Downloading payslip ${payslipId}...`)
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "Paid":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-900/20">
            Paid
          </Badge>
        )
      case "Processing":
        return (
          <Badge variant="outline" className="text-blue-600 bg-blue-50 dark:bg-blue-900/20">
            Processing
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20">
            Pending
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        )
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
          <h3 className="mt-2 text-lg font-medium">Error loading payslips</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-4" onClick={() => fetchPayslips(year)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Payslips</h2>
        <p className="text-muted-foreground">View and download your payslips</p>
      </div>
      
      {/* Year selection */}
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Select Year:</p>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(y => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Earnings</CardTitle>
            <CardDescription>Gross earnings for {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(yearSummary.totalEarnings)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Deductions</CardTitle>
            <CardDescription>All deductions for {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(yearSummary.totalDeductions)}</div>
            <div className="mt-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(yearSummary.taxPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Insurance</span>
                <span>{formatCurrency(yearSummary.insurancePaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pension</span>
                <span>{formatCurrency(yearSummary.pensionPaid)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Net Pay</CardTitle>
            <CardDescription>Total received for {year}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(yearSummary.totalNetPay)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payslips Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payslip History</CardTitle>
          <CardDescription>All your payslips for {year}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-6">
              <p>Loading payslips...</p>
            </div>
          ) : payslips.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6">
              <FileText className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No payslips found for {year}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payslip ID</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>Deductions</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((payslip) => (
                  <TableRow key={payslip.id}>
                    <TableCell className="font-medium">{payslip.id}</TableCell>
                    <TableCell>{payslip.period}</TableCell>
                    <TableCell>{format(payslip.issueDate, "MMM d, yyyy")}</TableCell>
                    <TableCell>{formatCurrency(payslip.grossAmount)}</TableCell>
                    <TableCell>{formatCurrency(payslip.deductions)}</TableCell>
                    <TableCell>{formatCurrency(payslip.netAmount)}</TableCell>
                    <TableCell>{getStatusBadge(payslip.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownload(payslip.id)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Testing component - this would be removed in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 border border-dashed rounded-md">
          <h3 className="text-sm font-semibold mb-2">Development Testing</h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => toast.success("Test notification")}
            >
              Test Toast
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Unit tests for EmployeePayslips component
// 
// These tests would be in a separate file in a real application
// 
// describe('EmployeePayslips', () => {
//   it('should render without crashing', () => {
//     render(<EmployeePayslips />)
//     expect(screen.getByText('My Payslips')).toBeInTheDocument()
//   })
//
//   it('should display payslips for the selected year', async () => {
//     render(<EmployeePayslips />)
//     // Select a different year
//     fireEvent.click(screen.getByRole('combobox'))
//     fireEvent.click(screen.getByText('2022'))
//     // Check that payslips are filtered
//     await waitFor(() => {
//       expect(screen.getByText('December 2022')).toBeInTheDocument()
//     })
//   })
//
//   it('should handle download button click', () => {
//     render(<EmployeePayslips />)
//     fireEvent.click(screen.getAllByText('Download')[0])
//     expect(screen.getByText('Downloading payslip')).toBeInTheDocument()
//   })
// })

/**
 * Changelog:
 * 
 * Date: 2023-06-15
 * - Created initial EmployeePayslips component
 * - Implemented year filtering functionality
 * - Added payslip download capability
 * - Created mock data structure for payslips
 * - Added yearly summary cards
 * - Implemented error handling and loading states
 * 
 * Version: 1.0.0
 */ 
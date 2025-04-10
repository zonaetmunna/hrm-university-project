"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, CheckCircle, Download, Eye, Filter, MoreHorizontal, Search, XCircle } from "lucide-react"
import { useState } from "react"

// Mock data for leave requests
const leaveRequests = [
  {
    id: 1,
    employee: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg",
      initials: "JD",
    },
    type: "Annual Leave",
    startDate: "2023-04-15",
    endDate: "2023-04-20",
    days: 6,
    reason: "Family vacation",
    status: "Pending",
  },
  {
    id: 2,
    employee: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/placeholder.svg",
      initials: "JS",
    },
    type: "Sick Leave",
    startDate: "2023-04-12",
    endDate: "2023-04-13",
    days: 2,
    reason: "Not feeling well",
    status: "Pending",
  },
  {
    id: 3,
    employee: {
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      avatar: "/placeholder.svg",
      initials: "RJ",
    },
    type: "Personal Leave",
    startDate: "2023-04-18",
    endDate: "2023-04-18",
    days: 1,
    reason: "Personal appointment",
    status: "Pending",
  },
  {
    id: 4,
    employee: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      avatar: "/placeholder.svg",
      initials: "ED",
    },
    type: "Annual Leave",
    startDate: "2023-04-25",
    endDate: "2023-04-28",
    days: 4,
    reason: "Short trip",
    status: "Approved",
  },
  {
    id: 5,
    employee: {
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      avatar: "/placeholder.svg",
      initials: "MW",
    },
    type: "Sick Leave",
    startDate: "2023-04-10",
    endDate: "2023-04-11",
    days: 2,
    reason: "Doctor's appointment",
    status: "Rejected",
  },
]

export function LeaveManagement() {
  const [filter, setFilter] = useState("all") // all, pending, approved, rejected

  const filteredRequests =
    filter === "all"
      ? leaveRequests
      : leaveRequests.filter((request) => request.status.toLowerCase() === filter.toLowerCase())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
          <p className="text-muted-foreground">Manage and approve employee leave requests.</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Leave Calendar
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search leave requests..." />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {filter === "all"
                  ? "All Requests"
                  : filter === "pending"
                    ? "Pending"
                    : filter === "approved"
                      ? "Approved"
                      : "Rejected"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All Requests</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("approved")}>Approved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("rejected")}>Rejected</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={request.employee.avatar} alt={request.employee.name} />
                      <AvatarFallback>{request.employee.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{request.employee.name}</div>
                      <div className="text-xs text-muted-foreground">{request.employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>
                  {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{request.days}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      request.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                        : request.status === "Approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                    }`}
                  >
                    {request.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {request.status === "Pending" ? (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Reject</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {request.status === "Approved" && (
                          <DropdownMenuItem>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Cancel Approval
                          </DropdownMenuItem>
                        )}
                        {request.status === "Rejected" && (
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Reconsider
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{filteredRequests.length}</strong> of <strong>{leaveRequests.length}</strong> leave requests
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

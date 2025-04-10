/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  CheckCircle,
  Download,
  Eye,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Search,
  XCircle,
} from "lucide-react"
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

export function LeaveApprovals() {
  const [filter, setFilter] = useState("all") // all, pending, approved, rejected
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)

  const filteredRequests =
    filter === "all"
      ? leaveRequests
      : leaveRequests.filter((request) => request.status.toLowerCase() === filter.toLowerCase())

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request)
    setIsViewDetailsOpen(true)
  }

  const handleReject = (request: any) => {
    setSelectedRequest(request)
    setIsRejectDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leave Approvals</h2>
          <p className="text-muted-foreground">Manage and approve team leave requests.</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Leave Calendar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requests awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Requests approved this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Requests rejected this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Total requests this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search leave requests..." />
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={filter} onValueChange={setFilter} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
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
                  <Badge
                    variant="outline"
                    className={`${
                      request.status === "Pending"
                        ? "border-amber-500 text-amber-500"
                        : request.status === "Approved"
                          ? "border-green-500 text-green-500"
                          : "border-red-500 text-red-500"
                    }`}
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {request.status === "Pending" ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-500">
                        <CheckCircle className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => handleReject(request)}
                      >
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>View detailed information about this leave request.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedRequest.employee.avatar} alt={selectedRequest.employee.name} />
                  <AvatarFallback>{selectedRequest.employee.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedRequest.employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedRequest.employee.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Leave Type</Label>
                  <p className="font-medium">{selectedRequest.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p
                    className={`font-medium ${
                      selectedRequest.status === "Pending"
                        ? "text-amber-500"
                        : selectedRequest.status === "Approved"
                          ? "text-green-500"
                          : "text-red-500"
                    }`}
                  >
                    {selectedRequest.status}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Start Date</Label>
                  <p className="font-medium">{new Date(selectedRequest.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">End Date</Label>
                  <p className="font-medium">{new Date(selectedRequest.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Duration</Label>
                  <p className="font-medium">{selectedRequest.days} days</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Requested On</Label>
                  <p className="font-medium">April 5, 2023</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Reason</Label>
                <p className="font-medium">{selectedRequest.reason}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedRequest && selectedRequest.status === "Pending" ? (
              <>
                <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsViewDetailsOpen(false)
                    handleReject(selectedRequest)
                  }}
                >
                  Reject
                </Button>
                <Button>Approve</Button>
              </>
            ) : (
              <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this leave request.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rejection-reason" className="text-right">
                Reason
              </Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter reason for rejection"
                className="col-span-3"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setIsRejectDialogOpen(false)}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Team Leave Calendar</CardTitle>
          <CardDescription>Overview of upcoming team leaves</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Calendar className="h-16 w-16 text-muted-foreground" />
          <span className="ml-4 text-muted-foreground">Team leave calendar visualization</span>
        </CardContent>
      </Card>
    </div>
  )
}

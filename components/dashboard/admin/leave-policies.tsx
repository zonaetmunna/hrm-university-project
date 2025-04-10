"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Download, Edit, Filter, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"

// Mock data for leave policies
const leavePolicies = [
  {
    id: 1,
    name: "Annual Leave",
    days: 20,
    accrual: "Monthly",
    carryOver: 5,
    applicableTo: "All Employees",
    status: "Active",
  },
  {
    id: 2,
    name: "Sick Leave",
    days: 10,
    accrual: "Yearly",
    carryOver: 0,
    applicableTo: "All Employees",
    status: "Active",
  },
  {
    id: 3,
    name: "Maternity Leave",
    days: 90,
    accrual: "N/A",
    carryOver: 0,
    applicableTo: "Female Employees",
    status: "Active",
  },
  {
    id: 4,
    name: "Paternity Leave",
    days: 14,
    accrual: "N/A",
    carryOver: 0,
    applicableTo: "Male Employees",
    status: "Active",
  },
  {
    id: 5,
    name: "Bereavement Leave",
    days: 5,
    accrual: "N/A",
    carryOver: 0,
    applicableTo: "All Employees",
    status: "Active",
  },
  {
    id: 6,
    name: "Unpaid Leave",
    days: 30,
    accrual: "N/A",
    carryOver: 0,
    applicableTo: "All Employees",
    status: "Active",
  },
  {
    id: 7,
    name: "Study Leave",
    days: 10,
    accrual: "Yearly",
    carryOver: 0,
    applicableTo: "Full-time Employees",
    status: "Inactive",
  },
]

export function LeavePolicies() {
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false)
  const [isProRated, setIsProRated] = useState(true)
  const [requiresApproval, setRequiresApproval] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leave Policies</h2>
          <p className="text-muted-foreground">Manage organization-wide leave policies and entitlements.</p>
        </div>
        <Dialog open={isAddPolicyOpen} onOpenChange={setIsAddPolicyOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Leave Policy</DialogTitle>
              <DialogDescription>Create a new leave policy for your organization.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="policy-name" className="text-right">
                  Policy Name
                </Label>
                <Input id="policy-name" placeholder="e.g., Annual Leave" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="days" className="text-right">
                  Days Per Year
                </Label>
                <Input id="days" type="number" min="0" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="accrual" className="text-right">
                  Accrual Basis
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select accrual basis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="na">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="carry-over" className="text-right">
                  Max Carry Over
                </Label>
                <Input id="carry-over" type="number" min="0" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="applicable-to" className="text-right">
                  Applicable To
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select employee group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="full-time">Full-time Employees</SelectItem>
                    <SelectItem value="part-time">Part-time Employees</SelectItem>
                    <SelectItem value="contract">Contract Employees</SelectItem>
                    <SelectItem value="male">Male Employees</SelectItem>
                    <SelectItem value="female">Female Employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  <Label htmlFor="pro-rated">Pro-rated for new joiners</Label>
                </div>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch id="pro-rated" checked={isProRated} onCheckedChange={setIsProRated} />
                  <Label htmlFor="pro-rated">Enabled</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">
                  <Label htmlFor="requires-approval">Requires Approval</Label>
                </div>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch id="requires-approval" checked={requiresApproval} onCheckedChange={setRequiresApproval} />
                  <Label htmlFor="requires-approval">Enabled</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter policy description and details"
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPolicyOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddPolicyOpen(false)}>Save Policy</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search policies..." />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Holiday Calendar
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy Name</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Accrual</TableHead>
              <TableHead>Carry Over</TableHead>
              <TableHead>Applicable To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leavePolicies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.name}</TableCell>
                <TableCell>{policy.days}</TableCell>
                <TableCell>{policy.accrual}</TableCell>
                <TableCell>{policy.carryOver}</TableCell>
                <TableCell>{policy.applicableTo}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      policy.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                    }`}
                  >
                    {policy.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
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
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Policy
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {policy.status === "Active" ? (
                          <>
                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                            <span className="text-red-500">Deactivate</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-green-500">Activate</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Policy
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{leavePolicies.length}</strong> of <strong>{leavePolicies.length}</strong> policies
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

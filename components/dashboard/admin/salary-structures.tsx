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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Download, Edit, Filter, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useState } from "react"

// Mock data for salary structures
const salaryStructures = [
  {
    id: 1,
    name: "Executive",
    minSalary: "$150,000",
    maxSalary: "$300,000",
    currency: "USD",
    frequency: "Annual",
    department: "All",
    status: "Active",
  },
  {
    id: 2,
    name: "Senior Management",
    minSalary: "$100,000",
    maxSalary: "$180,000",
    currency: "USD",
    frequency: "Annual",
    department: "All",
    status: "Active",
  },
  {
    id: 3,
    name: "Middle Management",
    minSalary: "$80,000",
    maxSalary: "$120,000",
    currency: "USD",
    frequency: "Annual",
    department: "All",
    status: "Active",
  },
  {
    id: 4,
    name: "Senior Developer",
    minSalary: "$90,000",
    maxSalary: "$140,000",
    currency: "USD",
    frequency: "Annual",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 5,
    name: "Junior Developer",
    minSalary: "$60,000",
    maxSalary: "$85,000",
    currency: "USD",
    frequency: "Annual",
    department: "Engineering",
    status: "Active",
  },
  {
    id: 6,
    name: "Marketing Specialist",
    minSalary: "$55,000",
    maxSalary: "$90,000",
    currency: "USD",
    frequency: "Annual",
    department: "Marketing",
    status: "Active",
  },
  {
    id: 7,
    name: "HR Coordinator",
    minSalary: "$50,000",
    maxSalary: "$75,000",
    currency: "USD",
    frequency: "Annual",
    department: "Human Resources",
    status: "Inactive",
  },
]

// Mock data for allowances
const allowances = [
  {
    id: 1,
    name: "Housing Allowance",
    amount: "$1,000",
    frequency: "Monthly",
    taxable: "Yes",
    applicableTo: "Executive, Senior Management",
    status: "Active",
  },
  {
    id: 2,
    name: "Transportation Allowance",
    amount: "$500",
    frequency: "Monthly",
    taxable: "No",
    applicableTo: "All Employees",
    status: "Active",
  },
  {
    id: 3,
    name: "Meal Allowance",
    amount: "$300",
    frequency: "Monthly",
    taxable: "No",
    applicableTo: "All Employees",
    status: "Active",
  },
  {
    id: 4,
    name: "Education Allowance",
    amount: "$2,000",
    frequency: "Annual",
    taxable: "No",
    applicableTo: "All Employees",
    status: "Active",
  },
]

export function SalaryStructures() {
  const [isAddStructureOpen, setIsAddStructureOpen] = useState(false)
  const [isAddAllowanceOpen, setIsAddAllowanceOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Salary Structures</h2>
          <p className="text-muted-foreground">Manage salary structures, grades, and allowances.</p>
        </div>
      </div>

      <Tabs defaultValue="structures" className="space-y-4">
        <TabsList>
          <TabsTrigger value="structures">Salary Structures</TabsTrigger>
          <TabsTrigger value="allowances">Allowances & Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="structures" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search structures..." />
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
              <Dialog open={isAddStructureOpen} onOpenChange={setIsAddStructureOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Structure
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Salary Structure</DialogTitle>
                    <DialogDescription>Create a new salary structure or grade.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="structure-name" className="text-right">
                        Structure Name
                      </Label>
                      <Input id="structure-name" placeholder="e.g., Senior Developer" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="min-salary" className="text-right">
                        Minimum Salary
                      </Label>
                      <Input id="min-salary" type="number" min="0" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="max-salary" className="text-right">
                        Maximum Salary
                      </Label>
                      <Input id="max-salary" type="number" min="0" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="currency" className="text-right">
                        Currency
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD</SelectItem>
                          <SelectItem value="eur">EUR</SelectItem>
                          <SelectItem value="gbp">GBP</SelectItem>
                          <SelectItem value="jpy">JPY</SelectItem>
                          <SelectItem value="cad">CAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="frequency" className="text-right">
                        Frequency
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">
                        Department
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddStructureOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddStructureOpen(false)}>Save Structure</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Structure Name</TableHead>
                  <TableHead>Min Salary</TableHead>
                  <TableHead>Max Salary</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryStructures.map((structure) => (
                  <TableRow key={structure.id}>
                    <TableCell className="font-medium">{structure.name}</TableCell>
                    <TableCell>{structure.minSalary}</TableCell>
                    <TableCell>{structure.maxSalary}</TableCell>
                    <TableCell>{structure.currency}</TableCell>
                    <TableCell>{structure.frequency}</TableCell>
                    <TableCell>{structure.department}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          structure.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                        }`}
                      >
                        {structure.status}
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
                            Edit Structure
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {structure.status === "Active" ? (
                              <>
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                <span className="text-red-500">Deactivate</span>
                              </>
                            ) : (
                              <>
                                <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                                <span className="text-green-500">Activate</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Structure
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
              Showing <strong>{salaryStructures.length}</strong> of <strong>{salaryStructures.length}</strong>{" "}
              structures
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
        </TabsContent>

        <TabsContent value="allowances" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search allowances..." />
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
              <Dialog open={isAddAllowanceOpen} onOpenChange={setIsAddAllowanceOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Allowance
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Allowance</DialogTitle>
                    <DialogDescription>Create a new allowance or benefit.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="allowance-name" className="text-right">
                        Allowance Name
                      </Label>
                      <Input id="allowance-name" placeholder="e.g., Housing Allowance" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        Amount
                      </Label>
                      <Input id="amount" type="number" min="0" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="frequency" className="text-right">
                        Frequency
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="biannual">Bi-annual</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="onetime">One-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="taxable" className="text-right">
                        Taxable
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="executive">Executive</SelectItem>
                          <SelectItem value="management">Management</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddAllowanceOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddAllowanceOpen(false)}>Save Allowance</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Allowance Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Taxable</TableHead>
                  <TableHead>Applicable To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allowances.map((allowance) => (
                  <TableRow key={allowance.id}>
                    <TableCell className="font-medium">{allowance.name}</TableCell>
                    <TableCell>{allowance.amount}</TableCell>
                    <TableCell>{allowance.frequency}</TableCell>
                    <TableCell>{allowance.taxable}</TableCell>
                    <TableCell>{allowance.applicableTo}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          allowance.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                        }`}
                      >
                        {allowance.status}
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
                            Edit Allowance
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {allowance.status === "Active" ? (
                              <>
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                <span className="text-red-500">Deactivate</span>
                              </>
                            ) : (
                              <>
                                <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                                <span className="text-green-500">Activate</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Allowance
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
              Showing <strong>{allowances.length}</strong> of <strong>{allowances.length}</strong> allowances
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
        </TabsContent>
      </Tabs>
    </div>
  )
}

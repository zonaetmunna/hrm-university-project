"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Download, Edit, Eye, Filter, MoreHorizontal, Search, ShieldCheck, Trash2 } from "lucide-react"
import { useState } from "react"

// Mock data for roles
const roles = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access with all permissions",
    users: 5,
    permissions: 42,
    status: "Active",
  },
  {
    id: 2,
    name: "HR Manager",
    description: "Manages HR functions and employee data",
    users: 12,
    permissions: 28,
    status: "Active",
  },
  {
    id: 3,
    name: "Team Lead",
    description: "Manages team members and projects",
    users: 24,
    permissions: 18,
    status: "Active",
  },
  {
    id: 4,
    name: "Employee",
    description: "Basic access to employee self-service",
    users: 98,
    permissions: 8,
    status: "Active",
  },
  {
    id: 5,
    name: "Contractor",
    description: "Limited access for external contractors",
    users: 15,
    permissions: 5,
    status: "Inactive",
  },
]

export function RoleManagement() {
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Role & Permission Management</h2>
          <p className="text-muted-foreground">Manage roles and assign permissions to users.</p>
        </div>
        <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
          <DialogTrigger asChild>
            <Button>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>Create a new role with specific permissions.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role-name" className="text-right">
                  Role Name
                </Label>
                <Input id="role-name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role-description" className="text-right">
                  Description
                </Label>
                <Textarea id="role-description" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">Permissions</Label>
                <div className="col-span-3 grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">User Management</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="perm-view-users" />
                        <Label htmlFor="perm-view-users">View Users</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="perm-create-users" />
                        <Label htmlFor="perm-create-users">Create Users</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="perm-edit-users" />
                        <Label htmlFor="perm-edit-users">Edit Users</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="perm-delete-users" />
                        <Label htmlFor="perm-delete-users">Delete Users</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Department Management</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="perm-view-depts" />
                        <Label htmlFor="perm-view-depts">View Departments</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="perm-create-depts" />
                        <Label htmlFor="perm-create-depts">Create Departments</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="perm-edit-depts" />
                        <Label htmlFor="perm-edit-depts">Edit Departments</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="perm-delete-depts" />
                        <Label htmlFor="perm-delete-depts">Delete Departments</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddRoleOpen(false)}>Save Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search roles..." />
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
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>{role.users}</TableCell>
                <TableCell>{role.permissions}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      role.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {role.status}
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
                        <Eye className="mr-2 h-4 w-4" />
                        View Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Role
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
          Showing <strong>5</strong> of <strong>5</strong> roles
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

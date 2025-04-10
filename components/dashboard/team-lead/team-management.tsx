"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Edit, Eye, Filter, MessageSquare, MoreHorizontal, Search, TrendingUp } from "lucide-react"
import { useState } from "react"

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg",
    initials: "JD",
    position: "Senior Developer",
    project: "Website Redesign",
    performance: 85,
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/placeholder.svg",
    initials: "JS",
    position: "UX Designer",
    project: "Mobile App",
    performance: 92,
    status: "On Leave",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    avatar: "/placeholder.svg",
    initials: "RJ",
    position: "Backend Developer",
    project: "API Integration",
    performance: 65,
    status: "Active",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    avatar: "/placeholder.svg",
    initials: "ED",
    position: "UI Designer",
    project: "UI Design",
    performance: 78,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    avatar: "/placeholder.svg",
    initials: "MW",
    position: "Frontend Developer",
    project: "Website Redesign",
    performance: 88,
    status: "Active",
  },
]

export function TeamManagement() {
  const [filter, setFilter] = useState("all") // all, active, on-leave, inactive

  const filteredMembers =
    filter === "all"
      ? teamMembers
      : teamMembers.filter((member) => member.status.toLowerCase().replace(" ", "-") === filter.toLowerCase())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
          <p className="text-muted-foreground">Manage your team members and their performance.</p>
        </div>
        <Button>
          <TrendingUp className="mr-2 h-4 w-4" />
          Performance Review
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search team members..." />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {filter === "all"
                  ? "All Members"
                  : filter === "active"
                    ? "Active"
                    : filter === "on-leave"
                      ? "On Leave"
                      : "Inactive"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>All Members</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("active")}>Active</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("on-leave")}>On Leave</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("inactive")}>Inactive</DropdownMenuItem>
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
              <TableHead>Position</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.position}</TableCell>
                <TableCell>{member.project}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={member.performance} className="h-2 w-16" />
                    <span className="text-xs font-medium">{member.performance}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      member.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        : member.status === "On Leave"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                    }`}
                  >
                    {member.status}
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
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Performance Review
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Feedback
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Member
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
          Showing <strong>{filteredMembers.length}</strong> of <strong>{teamMembers.length}</strong> team members
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

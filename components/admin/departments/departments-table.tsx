"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { DepartmentForm } from "./department-form"

interface Department {
  id: string
  name: string
  description: string | null
  employeeCount: number
}

export function DepartmentsTable() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchDepartments()
  }, [])

  async function fetchDepartments() {
    try {
      const response = await fetch("/api/admin/departments")
      if (!response.ok) {
        throw new Error("Failed to fetch departments")
      }
      const data = await response.json()
      setDepartments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this department?")) return

    try {
      const response = await fetch(`/api/admin/departments/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete department")
      }

      setDepartments(departments.filter((dept) => dept.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => {
          setSelectedDepartment(null)
          setIsFormOpen(true)
        }}>Add Department</Button>
      </div>

      {departments.length === 0 && !loading ? (
        <div className="text-center p-8 bg-muted/50 rounded-md">
          <p className="text-muted-foreground">No departments found. Create your first department to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDepartments.map((department) => (
              <TableRow key={department.id}>
                <TableCell className="font-medium">{department.name}</TableCell>
                <TableCell>{department.description || "-"}</TableCell>
                <TableCell>{department.employeeCount}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedDepartment(department)
                          setIsFormOpen(true)
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(department.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <DepartmentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        department={selectedDepartment || undefined}
        onSuccess={() => {
          fetchDepartments()
          setSelectedDepartment(null)
        }}
      />
    </div>
  )
} 
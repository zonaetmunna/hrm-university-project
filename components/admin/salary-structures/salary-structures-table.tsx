 "use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SalaryStructure, useDeleteSalaryStructure, useSalaryStructures } from "@/hooks/use-salary-structures"
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { SalaryStructureForm } from "./salary-structure-form"

export function SalaryStructuresTable() {
  const [search, setSearch] = useState("")
  const [selectedStructure, setSelectedStructure] = useState<SalaryStructure | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  // TanStack Query hooks
  const { data: salaryStructures, isLoading, error } = useSalaryStructures()
  const deleteSalaryStructure = useDeleteSalaryStructure()

  // Filter structures based on search
  const filteredStructures = salaryStructures?.filter((structure) =>
    structure.name.toLowerCase().includes(search.toLowerCase())
  ) || []

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this salary structure?")) return
    deleteSalaryStructure.mutate(id)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to load salary structures"}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search salary structures..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => {
          setSelectedStructure(null)
          setIsFormOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Structure
        </Button>
      </div>

      {filteredStructures.length === 0 ? (
        <div className="text-center p-8 bg-muted/50 rounded-md">
          <p className="text-muted-foreground">No salary structures found. Create your first structure to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>Max Salary</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Allowances</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStructures.map((structure) => (
              <TableRow key={structure.id}>
                <TableCell className="font-medium">{structure.name}</TableCell>
                <TableCell>{formatCurrency(structure.baseSalary)}</TableCell>
                <TableCell>{formatCurrency(structure.maxSalary)}</TableCell>
                <TableCell>{structure.bonusPercentage}%</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {structure.allowances.map((allowance, index) => (
                      <Badge key={index} variant="outline">{allowance}</Badge>
                    ))}
                  </div>
                </TableCell>
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
                          setSelectedStructure(structure)
                          setIsFormOpen(true)
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(structure.id)}
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

      <SalaryStructureForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        structure={selectedStructure}
      />
    </div>
  )
}
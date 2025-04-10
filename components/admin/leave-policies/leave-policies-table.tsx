"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { LeavePolicy, useDeleteLeavePolicy, useLeavePolicies } from "@/hooks/use-leave-policies"
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { LeavePolicyForm } from "./leave-policy-form"

export function LeavePoliciesTable() {
  const [search, setSearch] = useState("")
  const [selectedPolicy, setSelectedPolicy] = useState<LeavePolicy | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  // TanStack Query hooks
  const { data: leavePolicies, isLoading, error } = useLeavePolicies()
  const deleteLeavePolicy = useDeleteLeavePolicy()

  // Filter policies based on search
  const filteredPolicies = leavePolicies?.filter((policy) =>
    policy.name.toLowerCase().includes(search.toLowerCase())
  ) || []

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this leave policy?")) return
    deleteLeavePolicy.mutate(id)
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
          {error instanceof Error ? error.message : "Failed to load leave policies"}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search leave policies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => {
          setSelectedPolicy(null)
          setIsFormOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Policy
        </Button>
      </div>

      {filteredPolicies.length === 0 ? (
        <div className="text-center p-8 bg-muted/50 rounded-md">
          <p className="text-muted-foreground">No leave policies found. Create your first policy to get started.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Days Per Year</TableHead>
              <TableHead>Carry Over Limit</TableHead>
              <TableHead>Minimum Tenure (months)</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPolicies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.name}</TableCell>
                <TableCell>{policy.daysPerYear}</TableCell>
                <TableCell>{policy.carryOverLimit}</TableCell>
                <TableCell>{policy.minimumTenure}</TableCell>
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
                          setSelectedPolicy(policy)
                          setIsFormOpen(true)
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(policy.id)}
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

      <LeavePolicyForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        policy={selectedPolicy}
      />
    </div>
  )
} 
"use client"


import { SalaryStructuresTable } from "@/components/admin/salary-structures/salary-structures-table"
import { Separator } from "@/components/ui/separator"

export default function SalaryStructuresPage() {
  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Salary Structures</h1>
          <p className="text-muted-foreground">Manage salary structures for different roles across departments</p>
        </div>
      </div>
      <Separator />
      <SalaryStructuresTable />
    </div>
  )
}

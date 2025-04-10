"use client"

import { LeavePoliciesTable } from "@/components/admin/leave-policies/leave-policies-table"
import { Separator } from "@/components/ui/separator"

export default function LeavePoliciesPage() {
  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leave Policies</h1>
          <p className="text-muted-foreground">Manage leave policies for your organization</p>
        </div>
      </div>
      <Separator />
      <LeavePoliciesTable />
    </div>
  )
}

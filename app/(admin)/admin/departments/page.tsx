import { DepartmentsTable } from "@/components/admin/departments/departments-table"

export default function DepartmentsPage() {
  return (
    <div className="space-y-4 p-8">
      <h1 className="text-3xl font-bold">Department Management</h1>
      <DepartmentsTable />
    </div>
  )
}

import { UsersTable } from "@/components/admin/users/users-table"

export default function AdminUsersPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UsersTable />
    </div>
  )
}

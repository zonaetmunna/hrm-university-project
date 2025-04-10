import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * AdminExpensesPage component
 * 
 * Displays the expense management dashboard for admin users
 * 
 * @returns JSX.Element
 */
export default function AdminExpensesPage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Expense Management" description="Track and approve organizational expenses" />
      
      <Card>
        <CardHeader>
          <CardTitle>Expenses Dashboard</CardTitle>
          <CardDescription>Track and manage company expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Expense management dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
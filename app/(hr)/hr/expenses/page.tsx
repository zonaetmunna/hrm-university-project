import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * HRExpensesPage component
 * 
 * Displays the expense management dashboard for HR users
 * 
 * @returns JSX.Element
 */
export default function HRExpensesPage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Expense Management" description="Track and approve employee expenses" />
      
      <Card>
        <CardHeader>
          <CardTitle>Expenses Dashboard</CardTitle>
          <CardDescription>Manage reimbursement requests and expense reports</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Expense management dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
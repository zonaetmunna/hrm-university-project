import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * HRReportsPage component
 * 
 * Displays the HR reporting dashboard for HR users
 * 
 * @returns JSX.Element
 */
export default function HRReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="HR Reports" description="Generate and view HR analytics and reports" />
      
      <Card>
        <CardHeader>
          <CardTitle>Reports Dashboard</CardTitle>
          <CardDescription>Access key HR metrics and analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <p>HR reports and analytics dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * AdminPerformancePage component
 * 
 * Displays the performance management dashboard for admin users
 * 
 * @returns JSX.Element
 */
export default function AdminPerformancePage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Performance Management" description="Track and manage employee performance across the organization" />
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
          <CardDescription>Organizational performance metrics and management tools</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Performance management dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
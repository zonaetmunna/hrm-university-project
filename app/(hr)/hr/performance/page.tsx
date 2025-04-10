import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * HRPerformancePage component
 * 
 * Displays the performance management dashboard for HR users
 * 
 * @returns JSX.Element
 */
export default function HRPerformancePage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Performance Management" description="Monitor and evaluate employee performance" />
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
          <CardDescription>Track KPIs and performance reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Performance management dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
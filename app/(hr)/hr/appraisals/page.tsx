import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * HRAppraisalsPage component
 * 
 * Displays the employee appraisals management dashboard for HR users
 * 
 * @returns JSX.Element
 */
export default function HRAppraisalsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Employee Appraisals" description="Manage employee performance appraisals" />
      
      <Card>
        <CardHeader>
          <CardTitle>Appraisals Dashboard</CardTitle>
          <CardDescription>Manage and track employee performance reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Employee appraisals dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
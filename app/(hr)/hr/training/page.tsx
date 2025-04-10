import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * HRTrainingPage component
 * 
 * Displays the employee training management dashboard for HR users
 * 
 * @returns JSX.Element
 */
export default function HRTrainingPage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Training Management" description="Organize and track employee training programs" />
      
      <Card>
        <CardHeader>
          <CardTitle>Training Dashboard</CardTitle>
          <CardDescription>Manage training courses and employee participation</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Training management dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
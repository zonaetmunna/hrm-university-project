/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * AdminTrainingPage component
 * 
 * Displays the training management dashboard for admin users
 * 
 * @returns JSX.Element
 */
export default function AdminTrainingPage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Training" description="Manage employee training programs and resources" />
      
      <Card>
        <CardHeader>
          <CardTitle>Training Dashboard</CardTitle>
          <CardDescription>Manage your organization's training initiatives</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Training management dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
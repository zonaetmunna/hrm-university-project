import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * HRRecruitmentPage component
 * 
 * Displays the recruitment management dashboard for HR users
 * 
 * @returns JSX.Element
 */
export default function HRRecruitmentPage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Recruitment" description="Manage job postings and candidate applications" />
      
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Dashboard</CardTitle>
          <CardDescription>Track open positions and candidate pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Recruitment management dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
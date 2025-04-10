/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * AdminRecruitmentPage component
 * 
 * Displays the recruitment dashboard for admin users
 * 
 * @returns JSX.Element
 */
export default function AdminRecruitmentPage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Recruitment" description="Manage recruitment processes and job postings" />
      
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Dashboard</CardTitle>
          <CardDescription>Manage your organization's recruitment processes</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Recruitment management dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
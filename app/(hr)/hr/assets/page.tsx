import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * HRAssetsPage component
 * 
 * Displays the asset management dashboard for HR users
 * 
 * @returns JSX.Element
 */
export default function HRAssetsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Asset Management" description="Track and manage company assets assigned to employees" />
      
      <Card>
        <CardHeader>
          <CardTitle>Assets Dashboard</CardTitle>
          <CardDescription>Manage company equipment and employee assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Asset management dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
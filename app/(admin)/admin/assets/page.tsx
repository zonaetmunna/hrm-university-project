import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

/**
 * AdminAssetsPage component
 * 
 * Displays the asset management dashboard for admin users
 * 
 * @returns JSX.Element
 */
export default function AdminAssetsPage() {
  return (
    <div className="flex flex-col gap-4">
      <Heading title="Asset Management" description="Track and manage organizational assets and equipment" />
      
      <Card>
        <CardHeader>
          <CardTitle>Assets Dashboard</CardTitle>
          <CardDescription>Track and manage company equipment and assets</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Asset management dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
} 
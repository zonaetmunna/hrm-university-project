import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download } from "lucide-react"

/**
 * Employee Documents Page
 *
 * This page displays all documents relevant to the employee including:
 * - Personal documents
 * - Company policies
 * - Forms and templates
 * - Contracts and agreements
 */
export default function EmployeeDocumentsPage() {
  // Mock data for documents - would be fetched from API in production
  const documents = [
    {
      id: "1",
      name: "Employment Contract",
      category: "Contracts",
      uploadedBy: "HR Department",
      dateUploaded: "2023-05-15",
      size: "1.2 MB",
    },
    {
      id: "2",
      name: "Employee Handbook",
      category: "Policies",
      uploadedBy: "HR Department",
      dateUploaded: "2023-04-10",
      size: "3.5 MB",
    },
    {
      id: "3",
      name: "Health Insurance Form",
      category: "Forms",
      uploadedBy: "Benefits Team",
      dateUploaded: "2023-06-22",
      size: "0.8 MB",
    },
    {
      id: "4",
      name: "Expense Policy",
      category: "Policies",
      uploadedBy: "Finance Department",
      dateUploaded: "2023-03-18",
      size: "1.5 MB",
    },
    {
      id: "5",
      name: "Annual Performance Review",
      category: "Reviews",
      uploadedBy: "Manager",
      dateUploaded: "2023-07-01",
      size: "1.1 MB",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <p className="text-muted-foreground">
          View and download your documents and company resources.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
          <CardDescription>
            Access all your important documents in one place.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>{doc.category}</TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                  <TableCell>{doc.dateUploaded}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 
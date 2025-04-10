import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, LifeBuoy, MessageSquare, Plus, Search } from "lucide-react"

/**
 * Employee Support Page
 *
 * A help desk system where employees can:
 * - Create new support tickets
 * - Track existing tickets
 * - View FAQs and documentation
 * - Contact HR or IT support directly
 */
export default function EmployeeSupportPage() {
  // Mock data for support tickets - would be fetched from API in production
  const tickets = [
    {
      id: "TIC-1001",
      title: "Unable to access payroll system",
      department: "IT Support",
      status: "In Progress",
      priority: "High",
      createdAt: "2023-06-25T10:30:00Z",
      updatedAt: "2023-06-26T14:20:00Z",
      description: "I cannot log into the payroll system since yesterday. I've tried resetting my password but still getting an error message.",
      messages: [
        {
          user: "John Smith (IT Support)",
          timestamp: "2023-06-26T14:20:00Z",
          content: "We're investigating this issue. It appears to be a system-wide problem affecting several users. We'll update you soon."
        }
      ]
    },
    {
      id: "TIC-998",
      title: "Request for new monitor",
      department: "Facilities",
      status: "Pending",
      priority: "Medium",
      createdAt: "2023-06-20T09:15:00Z",
      updatedAt: "2023-06-21T11:45:00Z",
      description: "My current monitor has dead pixels in the corner. I would like to request a replacement.",
      messages: [
        {
          user: "Maria Rodriguez (Facilities)",
          timestamp: "2023-06-21T11:45:00Z",
          content: "We've received your request. Please fill out the equipment request form attached and we'll process your request."
        }
      ]
    },
    {
      id: "TIC-982",
      title: "Question about health benefits",
      department: "HR",
      status: "Resolved",
      priority: "Normal",
      createdAt: "2023-06-15T13:45:00Z",
      updatedAt: "2023-06-17T10:30:00Z",
      description: "I have questions about vision coverage in our health plan. Can someone explain what's covered?",
      messages: [
        {
          user: "Emily Johnson (HR)",
          timestamp: "2023-06-16T09:20:00Z",
          content: "Vision coverage includes one eye exam per year and $150 allowance for frames or contacts. Would you like me to send you the full benefits document?"
        },
        {
          user: "You",
          timestamp: "2023-06-16T10:15:00Z",
          content: "Yes, please send the full document. Also, do we have any in-network providers nearby?"
        },
        {
          user: "Emily Johnson (HR)",
          timestamp: "2023-06-17T10:30:00Z",
          content: "I've attached the full benefits document and a list of in-network providers within 5 miles of the office. Let me know if you have any other questions!"
        }
      ]
    },
  ]

  // Group tickets by status
  const activeTickets = tickets.filter(t => t.status !== "Resolved")
  const resolvedTickets = tickets.filter(t => t.status === "Resolved")

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Support Center</h2>
        <p className="text-muted-foreground">
          Get help with technical issues, HR questions, or facilities requests.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Tickets
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resolved Tickets
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedTickets.length}</div>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quick Contact
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full">
              IT Support
            </Button>
            <Button variant="outline" className="w-full">
              HR Department
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tickets..."
            className="w-full pl-8"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Ticket
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Tickets</TabsTrigger>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="create">Create Ticket</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4 mt-4">
          {activeTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
          {activeTickets.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
                <p className="text-center text-muted-foreground">You have no active tickets!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4 mt-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </TabsContent>
        
        <TabsContent value="resolved" className="space-y-4 mt-4">
          {resolvedTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
          {resolvedTickets.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <LifeBuoy className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-center text-muted-foreground">No resolved tickets found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="create" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Support Ticket</CardTitle>
              <CardDescription>
                Please provide details about your issue so we can help you effectively.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Title
                </label>
                <Input placeholder="Brief description of your issue" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Department
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT Support</SelectItem>
                      <SelectItem value="hr">HR Department</SelectItem>
                      <SelectItem value="facilities">Facilities</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Priority
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Description
                </label>
                <Textarea 
                  placeholder="Provide details about your issue including what you were doing, when it started, and any error messages"
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">Cancel</Button>
              <Button>Submit Ticket</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="knowledge" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Find answers to common questions and issues.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search knowledge base..."
                  className="w-full pl-8"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Popular Articles</h3>
                <ul className="space-y-1">
                  <li className="rounded-md border p-3 hover:bg-muted">
                    <a href="#" className="block">How to reset your password</a>
                  </li>
                  <li className="rounded-md border p-3 hover:bg-muted">
                    <a href="#" className="block">Requesting time off in the HR system</a>
                  </li>
                  <li className="rounded-md border p-3 hover:bg-muted">
                    <a href="#" className="block">Setting up VPN for remote work</a>
                  </li>
                  <li className="rounded-md border p-3 hover:bg-muted">
                    <a href="#" className="block">Submitting expense reports</a>
                  </li>
                  <li className="rounded-md border p-3 hover:bg-muted">
                    <a href="#" className="block">Accessing healthcare benefits</a>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper component for displaying support tickets
function TicketCard({ ticket }: { ticket: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
      case 'Urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              {ticket.id}: {ticket.title}
            </CardTitle>
            <CardDescription>
              {ticket.department} • Created on {formatDate(ticket.createdAt)}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status}
            </Badge>
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{ticket.description}</p>
        
        {ticket.messages && ticket.messages.length > 0 && (
          <div className="border rounded-md p-3 mt-4 space-y-3">
            <h4 className="font-medium text-sm">Latest Updates</h4>
            {ticket.messages.map((message: any, index: number) => (
              <div key={index} className="text-sm border-t pt-2 first:border-t-0 first:pt-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{message.user}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
                <p className="mt-1">{message.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">View Details</Button>
        {ticket.status !== "Resolved" && (
          <Button>Reply</Button>
        )}
      </CardFooter>
    </Card>
  )
} 
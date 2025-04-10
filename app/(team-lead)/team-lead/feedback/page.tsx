/* eslint-disable react/no-unescaped-entities */
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle,
  Clock,
  MessageCircle,
  MessageSquare,
  Send,
  ThumbsUp
} from "lucide-react"

/**
 * Team Lead Feedback Page
 *
 * Allows team leaders to:
 * - Provide regular feedback to team members
 * - View feedback received from team members
 * - See pending feedback requests
 * - Analyze feedback history
 */
export default function TeamLeadFeedbackPage() {
  // Mock data for feedback - would be fetched from API in production
  const feedbackToTeam = [
    {
      id: "1",
      recipient: "John Smith",
      position: "Senior Developer",
      date: "2023-07-01",
      content: "Great job on the new authentication system. Your code was clean, well-documented, and delivered on time. I especially appreciated how you handled the edge cases we discussed.",
      status: "Delivered",
      type: "Positive",
    },
    {
      id: "2",
      recipient: "Emily Johnson",
      position: "Frontend Developer",
      date: "2023-06-28",
      content: "Your work on the UI components has been solid, but I'd like to see more attention to accessibility standards. Let's schedule some time to review the WCAG guidelines together.",
      status: "Delivered",
      type: "Constructive",
    },
    {
      id: "3",
      recipient: "Michael Davis",
      position: "Backend Developer",
      date: "2023-06-25",
      content: "I've noticed your API documentation could use improvement. Please ensure all endpoints are properly documented with examples and error responses for better team collaboration.",
      status: "Delivered",
      type: "Constructive",
    },
    {
      id: "4",
      recipient: "Sarah Wilson",
      position: "UI/UX Designer",
      date: "2023-06-20",
      content: "The latest design system components you created are excellent - they're consistent, intuitive, and address all the requirements. The team has already mentioned how much easier they are to implement.",
      status: "Delivered",
      type: "Positive",
    },
    {
      id: "5",
      recipient: "Robert Martinez",
      position: "Junior Developer",
      date: "2023-06-15",
      content: "Draft feedback about code organization and naming conventions.",
      status: "Draft",
      type: "Constructive",
    },
  ]

  const feedbackFromTeam = [
    {
      id: "6",
      sender: "John Smith",
      position: "Senior Developer",
      date: "2023-06-30",
      content: "I appreciate the autonomy you give me on projects while still providing guidance when needed. Our weekly check-ins have been very valuable for staying aligned.",
      type: "Positive",
    },
    {
      id: "7",
      sender: "Emily Johnson",
      position: "Frontend Developer",
      date: "2023-06-27",
      content: "Sometimes our sprint planning meetings run longer than necessary. Could we try a more structured agenda to make them more efficient?",
      type: "Constructive",
    },
    {
      id: "8",
      sender: "Team",
      position: "Anonymous Feedback",
      date: "2023-06-22",
      content: "The new project management process is working well, but we'd appreciate more notice when deadlines change. It can be difficult to adjust our schedules on short notice.",
      type: "Constructive",
    },
  ]

  const pendingFeedback = [
    {
      id: "9",
      recipient: "Sarah Wilson",
      position: "UI/UX Designer",
      dueDate: "2023-07-10",
      type: "Regular Performance Feedback",
    },
    {
      id: "10",
      recipient: "Michael Davis",
      position: "Backend Developer",
      dueDate: "2023-07-15",
      type: "Project Completion Review",
    }
  ]

  // Count statistics
  const positiveFeedbackCount = feedbackToTeam.filter(f => f.type === "Positive" && f.status === "Delivered").length
  const constructiveFeedbackCount = feedbackToTeam.filter(f => f.type === "Constructive" && f.status === "Delivered").length
  const draftFeedbackCount = feedbackToTeam.filter(f => f.status === "Draft").length
  const feedbackReceivedCount = feedbackFromTeam.length

  // Format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Team Feedback</h2>
        <p className="text-muted-foreground">
          Provide and receive feedback to help your team grow and improve.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Positive Feedback Given
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positiveFeedbackCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Constructive Feedback
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{constructiveFeedbackCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Draft Feedback
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftFeedbackCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Feedback Received
            </CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackReceivedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="to-team">
        <TabsList>
          <TabsTrigger value="to-team">Feedback to Team</TabsTrigger>
          <TabsTrigger value="from-team">Feedback from Team</TabsTrigger>
          <TabsTrigger value="pending">Pending Feedback</TabsTrigger>
          <TabsTrigger value="new-feedback">New Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="to-team" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback to Team Members</CardTitle>
              <CardDescription>
                Review the feedback you've provided to your team members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbackToTeam.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell className="font-medium">
                        <div>
                          {feedback.recipient}
                          <div className="text-sm text-muted-foreground">{feedback.position}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(feedback.date)}</TableCell>
                      <TableCell>
                        <Badge className={feedback.type === "Positive" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"}>
                          {feedback.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={feedback.status === "Draft" 
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" 
                          : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"}>
                          {feedback.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="from-team" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback from Team Members</CardTitle>
              <CardDescription>
                View feedback that your team has shared with you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbackFromTeam.map((feedback) => (
                <Card key={feedback.id} className="border border-muted">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-base">{feedback.sender}</CardTitle>
                        <CardDescription>{feedback.position} • {formatDate(feedback.date)}</CardDescription>
                      </div>
                      <Badge className={feedback.type === "Positive" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"}>
                        {feedback.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{feedback.content}</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" size="sm" className="ml-auto">
                      Respond
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Feedback</CardTitle>
              <CardDescription>
                Scheduled and upcoming feedback due for your team members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingFeedback.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Member</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingFeedback.map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell className="font-medium">{feedback.recipient}</TableCell>
                        <TableCell>{feedback.position}</TableCell>
                        <TableCell>{formatDate(feedback.dueDate)}</TableCell>
                        <TableCell>{feedback.type}</TableCell>
                        <TableCell>
                          <Button size="sm">Write Feedback</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-medium mb-1">All caught up!</h3>
                  <p className="text-muted-foreground">
                    You have no pending feedback to complete.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new-feedback" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Feedback</CardTitle>
              <CardDescription>
                Provide feedback to a team member about their work or performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Team Member</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Select a team member</option>
                  <option value="john">John Smith - Senior Developer</option>
                  <option value="emily">Emily Johnson - Frontend Developer</option>
                  <option value="michael">Michael Davis - Backend Developer</option>
                  <option value="sarah">Sarah Wilson - UI/UX Designer</option>
                  <option value="robert">Robert Martinez - Junior Developer</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Feedback Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="feedbackType" className="h-4 w-4" defaultChecked />
                    <span>Regular Feedback</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="feedbackType" className="h-4 w-4" />
                    <span>Performance Review</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="feedbackType" className="h-4 w-4" />
                    <span>Project Feedback</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">What went well?</label>
                <Textarea placeholder="Describe what the team member did well..." className="min-h-[100px]" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Areas for improvement</label>
                <Textarea placeholder="Suggest specific areas where the team member could improve..." className="min-h-[100px]" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Action items & next steps</label>
                <Textarea placeholder="List specific actions or resources to help them improve..." className="min-h-[100px]" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Save as Draft</Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send Feedback
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
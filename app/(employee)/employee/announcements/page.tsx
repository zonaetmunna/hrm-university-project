 
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BellRing, Calendar, Info } from "lucide-react"
import React from "react"

/**
 * Employee Announcements Page
 *
 * Displays company-wide and department-specific announcements including:
 * - Important announcements
 * - Company news
 * - Events and activities
 * - Policy updates
 */
export default function EmployeeAnnouncementsPage() {
  // Mock data for announcements - would be fetched from API in production
  const announcements = [
    {
      id: "1",
      title: "Company Picnic",
      content: "Join us for the annual company picnic this Saturday at Central Park from 12 PM to 5 PM. Food and drinks will be provided. Family members are welcome!",
      date: "2023-07-10",
      author: "HR Department",
      category: "Events",
      isImportant: false,
    },
    {
      id: "2",
      title: "Office Closure for Holiday",
      content: "Please note that the office will be closed on Monday, July 3rd in observance of Independence Day. Regular operations will resume on Tuesday, July 4th.",
      date: "2023-06-28",
      author: "Office Administration",
      category: "Important",
      isImportant: true,
    },
    {
      id: "3",
      title: "New Health Insurance Plan",
      content: "We are excited to announce our new comprehensive health insurance plan that will be effective starting August 1st. Please attend the information session on July 15th.",
      date: "2023-06-25",
      author: "Benefits Team",
      category: "News",
      isImportant: true,
    },
    {
      id: "4",
      title: "Employee Satisfaction Survey",
      content: "Our annual employee satisfaction survey will be distributed next week. Your feedback is important to us and helps us improve your workplace experience.",
      date: "2023-06-20",
      author: "Executive Team",
      category: "News",
      isImportant: false,
    },
    {
      id: "5",
      title: "New Project Management System",
      content: "We will be transitioning to a new project management system starting next month. Training sessions will be scheduled throughout July.",
      date: "2023-06-15",
      author: "IT Department",
      category: "News",
      isImportant: false,
    },
  ]

  // Group announcements by category
  const important = announcements.filter(a => a.isImportant)
  const news = announcements.filter(a => a.category === "News")
  const events = announcements.filter(a => a.category === "Events")


  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
        <p className="text-muted-foreground">
          Stay updated with the latest company news and announcements.
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Announcements</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-4">
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </TabsContent>
        
        <TabsContent value="important" className="space-y-4 mt-4">
          {important.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </TabsContent>
        
        <TabsContent value="news" className="space-y-4 mt-4">
          {news.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4 mt-4">
          {events.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper component for displaying announcements
function AnnouncementCard({ announcement }: { announcement: any }) {
  const icon = announcement.isImportant ? Info : 
              announcement.category === "Events" ? Calendar : BellRing
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="mt-1">
              {React.createElement(icon, { className: "h-5 w-5 text-muted-foreground" })}
            </div>
            <div>
              <CardTitle>{announcement.title}</CardTitle>
              <CardDescription>
                {announcement.author} • {formatDate(announcement.date)}
              </CardDescription>
            </div>
          </div>
          {announcement.isImportant && (
            <Badge variant="destructive">Important</Badge>
          )}
          {!announcement.isImportant && (
            <Badge variant="outline">{announcement.category}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p>{announcement.content}</p>
      </CardContent>
    </Card>
  )
} 
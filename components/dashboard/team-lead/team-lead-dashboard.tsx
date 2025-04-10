/* eslint-disable react/no-unescaped-entities */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react"

export function TeamLeadDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Team Lead Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your team.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 2
              </span>
              new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Leaves</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-red-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 2
              </span>
              from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Attendance</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.5%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 1.5%
              </span>
              from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <span className="text-amber-500 flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3 mr-1" /> 3%
              </span>
              behind schedule
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Overview of your team's status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>John Doe</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-300">
                      Present
                    </span>
                  </TableCell>
                  <TableCell>Website Redesign</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="h-2 w-16" />
                      <span className="text-xs font-medium">85%</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Avatar" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div>Jane Smith</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                      On Leave
                    </span>
                  </TableCell>
                  <TableCell>Mobile App</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="h-2 w-16" />
                      <span className="text-xs font-medium">92%</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Avatar" />
                        <AvatarFallback>RJ</AvatarFallback>
                      </Avatar>
                      <div>Robert Johnson</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-300">
                      Present
                    </span>
                  </TableCell>
                  <TableCell>API Integration</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="h-2 w-16" />
                      <span className="text-xs font-medium">65%</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Avatar" />
                        <AvatarFallback>ED</AvatarFallback>
                      </Avatar>
                      <div>Emily Davis</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-300">
                      Absent
                    </span>
                  </TableCell>
                  <TableCell>UI Design</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="h-2 w-16" />
                      <span className="text-xs font-medium">78%</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                View All Team Members
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Pending Leave Requests</CardTitle>
            <CardDescription>Requests requiring your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Jane Smith</p>
                    <span className="text-xs text-muted-foreground">Apr 15 - Apr 20</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Annual Leave</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="sr-only">Approve</span>
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Reject</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>RJ</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Robert Johnson</p>
                    <span className="text-xs text-muted-foreground">Apr 18</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Personal Leave</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="sr-only">Approve</span>
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Reject</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>MW</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Michael Wilson</p>
                    <span className="text-xs text-muted-foreground">Apr 22 - Apr 23</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Sick Leave</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="sr-only">Approve</span>
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Reject</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                View All Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Current projects and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Website Redesign</div>
                  <div className="text-xs text-muted-foreground">Due: Apr 30</div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>Progress</div>
                  <div>85%</div>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Mobile App Development</div>
                  <div className="text-xs text-muted-foreground">Due: May 15</div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>Progress</div>
                  <div>62%</div>
                </div>
                <Progress value={62} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">API Integration</div>
                  <div className="text-xs text-muted-foreground">Due: Apr 25</div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div>Progress</div>
                  <div>45%</div>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                View All Projects
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
            <CardDescription>Performance metrics for your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-sm text-muted-foreground">Task Completion</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">92%</div>
                  <div className="text-sm text-muted-foreground">On-time Delivery</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <Briefcase className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">4.2/5</div>
                  <div className="text-sm text-muted-foreground">Quality Rating</div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                View Detailed Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Feedback</CardTitle>
            <CardDescription>Recent feedback from team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" alt="Avatar" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <h3 className="text-sm font-medium">John Doe</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Need more clarity on the API integration requirements. Can we schedule a meeting?
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" alt="Avatar" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <h3 className="text-sm font-medium">Jane Smith</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">3 days ago</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The new design system is working great. It's improved our development speed significantly.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" alt="Avatar" />
                      <AvatarFallback>RJ</AvatarFallback>
                    </Avatar>
                    <h3 className="text-sm font-medium">Robert Johnson</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">5 days ago</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Concerned about the timeline for the mobile app. We might need additional resources.
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                Send Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

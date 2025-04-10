/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Award,
  BarChart,
  PieChart,
  TrendingUp,
  Users
} from "lucide-react"

/**
 * Team Leader Performance Page
 *
 * Displays team and individual performance metrics including:
 * - Overall team performance indicators
 * - Individual team member performance
 * - Projects progress tracking
 * - Performance reviews and feedback
 */
export default function TeamLeadPerformancePage() {
  // Mock data for team members - would be fetched from API in production
  const teamMembers = [
    {
      id: "1",
      name: "John Smith",
      position: "Senior Developer",
      avatar: "/avatars/01.png",
      productivity: 92,
      taskCompletion: 88,
      qualityScore: 95,
      attendance: 98,
      currentProjects: 3,
      status: "Excellent",
    },
    {
      id: "2",
      name: "Emily Johnson",
      position: "Frontend Developer",
      avatar: "/avatars/02.png",
      productivity: 85,
      taskCompletion: 90,
      qualityScore: 82,
      attendance: 95,
      currentProjects: 2,
      status: "Good",
    },
    {
      id: "3",
      name: "Michael Davis",
      position: "Backend Developer",
      avatar: "/avatars/03.png",
      productivity: 78,
      taskCompletion: 75,
      qualityScore: 85,
      attendance: 92,
      currentProjects: 2,
      status: "Good",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      position: "UI/UX Designer",
      avatar: "/avatars/04.png",
      productivity: 88,
      taskCompletion: 82,
      qualityScore: 90,
      attendance: 96,
      currentProjects: 2,
      status: "Good",
    },
    {
      id: "5",
      name: "Robert Martinez",
      position: "Junior Developer",
      avatar: "/avatars/05.png",
      productivity: 72,
      taskCompletion: 68,
      qualityScore: 75,
      attendance: 90,
      currentProjects: 1,
      status: "Needs Improvement",
    },
  ]

  // Mock data for team metrics - would be fetched from API in production
  const teamMetrics = {
    averageProductivity: 83,
    averageTaskCompletion: 80.6,
    averageQualityScore: 85.4,
    averageAttendance: 94.2,
    projectsOnTrack: 4,
    projectsAtRisk: 1,
    totalProjects: 5,
    improvementFromLastMonth: 5.2,
  }

  // Filter team members by performance status
  const excellentPerformers = teamMembers.filter(m => m.status === "Excellent")
  const goodPerformers = teamMembers.filter(m => m.status === "Good")
  const needsImprovement = teamMembers.filter(m => m.status === "Needs Improvement")

  // Calculate average performance score for each team member
  const getAveragePerformance = (member: any) => {
    return Math.round((member.productivity + member.taskCompletion + member.qualityScore + member.attendance) / 4)
  }

  // Sort team members by average performance (highest first)
  const sortedByPerformance = [...teamMembers].sort((a, b) => 
    getAveragePerformance(b) - getAveragePerformance(a)
  )

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Team Performance</h2>
        <p className="text-muted-foreground">
          Monitor and analyze your team's performance metrics and individual achievements.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Team Productivity
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMetrics.averageProductivity}%</div>
            <p className="text-xs text-muted-foreground">
              +{teamMetrics.improvementFromLastMonth}% from last month
            </p>
            <Progress value={teamMetrics.averageProductivity} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projects Status
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMetrics.projectsOnTrack}/{teamMetrics.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Projects on track
            </p>
            <div className="mt-3 flex gap-2">
              <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400">
                {teamMetrics.projectsOnTrack} On Track
              </Badge>
              <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400">
                {teamMetrics.projectsAtRisk} At Risk
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Performers
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{excellentPerformers.length}</div>
            <p className="text-xs text-muted-foreground">
              Team members with excellent performance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Team Size
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              Active team members
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Team Members</TabsTrigger>
          <TabsTrigger value="top">Top Performers</TabsTrigger>
          <TabsTrigger value="improvement">Needs Improvement</TabsTrigger>
          <TabsTrigger value="metrics">Team Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Overview</CardTitle>
              <CardDescription>
                Detailed performance metrics for all team members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Member</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-center">Productivity</TableHead>
                    <TableHead className="text-center">Task Completion</TableHead>
                    <TableHead className="text-center">Quality Score</TableHead>
                    <TableHead className="text-center">Attendance</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => {
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'Excellent':
                          return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        case 'Good':
                          return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        case 'Needs Improvement':
                          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        default:
                          return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }
                    }

                    return (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span>{member.productivity}%</span>
                            <Progress value={member.productivity} className="h-2 w-16 mt-1" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span>{member.taskCompletion}%</span>
                            <Progress value={member.taskCompletion} className="h-2 w-16 mt-1" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span>{member.qualityScore}%</span>
                            <Progress value={member.qualityScore} className="h-2 w-16 mt-1" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span>{member.attendance}%</span>
                            <Progress value={member.attendance} className="h-2 w-16 mt-1" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">Export Report</Button>
              <Button>Schedule Reviews</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="top" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>
                Team members with the highest performance metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedByPerformance.slice(0, 3).map((member, index) => (
                  <div key={member.id} className="flex items-center p-4 border rounded-lg">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary mr-4">
                      {index === 0 ? (
                        <Award className="h-5 w-5" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.position}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{getAveragePerformance(member)}%</div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Detailed Performance Analysis</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="improvement" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <CardTitle>Areas for Improvement</CardTitle>
              </div>
              <CardDescription>
                Team members who need additional support or mentoring.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {needsImprovement.length > 0 ? (
                <div className="space-y-4">
                  {needsImprovement.map((member) => (
                    <Card key={member.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{member.name} - {member.position}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Productivity ({member.productivity}%)</span>
                              <span className={member.productivity < 75 ? "text-red-500" : "text-green-500"}>
                                {member.productivity < 75 ? "Needs Improvement" : "Satisfactory"}
                              </span>
                            </div>
                            <Progress value={member.productivity} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Task Completion ({member.taskCompletion}%)</span>
                              <span className={member.taskCompletion < 75 ? "text-red-500" : "text-green-500"}>
                                {member.taskCompletion < 75 ? "Needs Improvement" : "Satisfactory"}
                              </span>
                            </div>
                            <Progress value={member.taskCompletion} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Quality Score ({member.qualityScore}%)</span>
                              <span className={member.qualityScore < 75 ? "text-red-500" : "text-green-500"}>
                                {member.qualityScore < 75 ? "Needs Improvement" : "Satisfactory"}
                              </span>
                            </div>
                            <Progress value={member.qualityScore} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">View Full Profile</Button>
                        <Button>Schedule 1:1 Meeting</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <TrendingUp className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-medium mb-1">All team members are performing well!</h3>
                  <p className="text-muted-foreground">
                    There are currently no team members who need improvement interventions.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Metrics</CardTitle>
              <CardDescription>
                Overview of the team's key performance indicators.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Average Productivity</span>
                    <span className="text-sm font-medium">{teamMetrics.averageProductivity}%</span>
                  </div>
                  <Progress value={teamMetrics.averageProductivity} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Average Task Completion</span>
                    <span className="text-sm font-medium">{teamMetrics.averageTaskCompletion}%</span>
                  </div>
                  <Progress value={teamMetrics.averageTaskCompletion} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Average Quality Score</span>
                    <span className="text-sm font-medium">{teamMetrics.averageQualityScore}%</span>
                  </div>
                  <Progress value={teamMetrics.averageQualityScore} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Average Attendance</span>
                    <span className="text-sm font-medium">{teamMetrics.averageAttendance}%</span>
                  </div>
                  <Progress value={teamMetrics.averageAttendance} className="h-2" />
                </div>
                
                <div className="grid gap-4 grid-cols-2 mt-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Performance Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                            Excellent
                          </span>
                          <span>{excellentPerformers.length} ({Math.round(excellentPerformers.length / teamMembers.length * 100)}%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                            Good
                          </span>
                          <span>{goodPerformers.length} ({Math.round(goodPerformers.length / teamMembers.length * 100)}%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                            Needs Improvement
                          </span>
                          <span>{needsImprovement.length} ({Math.round(needsImprovement.length / teamMembers.length * 100)}%)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Project Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                            On Track
                          </span>
                          <span>{teamMetrics.projectsOnTrack} ({Math.round(teamMetrics.projectsOnTrack / teamMetrics.totalProjects * 100)}%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                            At Risk
                          </span>
                          <span>{teamMetrics.projectsAtRisk} ({Math.round(teamMetrics.projectsAtRisk / teamMetrics.totalProjects * 100)}%)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Generate Comprehensive Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
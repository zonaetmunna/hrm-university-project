/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart2, CheckCircle2, Clock, Target } from "lucide-react"

/**
 * Employee Goals Page
 *
 * Displays the employee's personal and team goals with progress tracking:
 * - Personal development goals
 * - Performance goals
 * - Team goals
 * - Career progression goals
 */
export default function EmployeeGoalsPage() {
  // Mock data for goals - would be fetched from API in production
  const goals = [
    {
      id: "1",
      title: "Complete Advanced React Training",
      description: "Finish the advanced React course on Udemy and apply learned techniques in current project.",
      category: "Development",
      target: "July 30, 2023",
      progress: 75,
      status: "In Progress",
    },
    {
      id: "2",
      title: "Improve Code Quality Metrics",
      description: "Reduce code smells and technical debt by 20% as measured by SonarQube.",
      category: "Performance",
      target: "End of Q3",
      progress: 45,
      status: "In Progress",
    },
    {
      id: "3",
      title: "Mentor Junior Developer",
      description: "Provide regular mentoring sessions to help junior team member improve their skills.",
      category: "Team",
      target: "Ongoing",
      progress: 60,
      status: "In Progress",
    },
    {
      id: "4",
      title: "Improve Test Coverage",
      description: "Increase unit test coverage to at least 80% for all new code.",
      category: "Development",
      target: "End of Q2",
      progress: 100,
      status: "Completed",
    },
    {
      id: "5",
      title: "Obtain AWS Certification",
      description: "Study for and pass the AWS Certified Developer Associate exam.",
      category: "Career",
      target: "December 2023",
      progress: 25,
      status: "In Progress",
    },
  ]

  // Group goals by category
  const developmentGoals = goals.filter(g => g.category === "Development")
  const performanceGoals = goals.filter(g => g.category === "Performance")
  const teamGoals = goals.filter(g => g.category === "Team")
  const careerGoals = goals.filter(g => g.category === "Career")
  const completedGoals = goals.filter(g => g.status === "Completed")
  const inProgressGoals = goals.filter(g => g.status === "In Progress")

  // Calculate overall progress
  const overallProgress = goals.length ? 
    Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) : 0

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Goals</h2>
        <p className="text-muted-foreground">
          Track and manage your performance and development goals.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Progress
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Goals
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              In Progress
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressGoals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoals.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Goals</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </TabsContent>
        
        <TabsContent value="development" className="space-y-4 mt-4">
          {developmentGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4 mt-4">
          {performanceGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4 mt-4">
          {teamGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </TabsContent>
        
        <TabsContent value="career" className="space-y-4 mt-4">
          {careerGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </TabsContent>
      </Tabs>

      <Button className="mt-6">
        Request New Goal
      </Button>
    </div>
  )
}

// Helper component for displaying goals
function GoalCard({ goal }: { goal: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400'
      case 'In Progress':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Not Started':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{goal.title}</CardTitle>
        <CardDescription>Target: {goal.target}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{goal.progress}%</span>
        </div>
        <Progress value={goal.progress} className="h-2" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm font-medium">{goal.category}</div>
        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
          {goal.status}
        </div>
      </CardFooter>
    </Card>
  )
} 
 
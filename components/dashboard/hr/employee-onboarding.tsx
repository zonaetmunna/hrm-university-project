"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  Briefcase,
  Building,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Upload,
  User,
  UserPlus,
} from "lucide-react"
import { useState } from "react"

// Mock data for onboarding employees
const onboardingEmployees = [
  {
    id: 1,
    name: "Michael Wilson",
    position: "Senior Developer",
    department: "Engineering",
    startDate: "2023-04-15",
    avatar: "/placeholder.svg",
    initials: "MW",
    status: "In Progress",
    progress: 65,
    stage: "Documentation",
  },
  {
    id: 2,
    name: "Emily Davis",
    position: "Marketing Specialist",
    department: "Marketing",
    startDate: "2023-04-18",
    avatar: "/placeholder.svg",
    initials: "ED",
    status: "In Progress",
    progress: 40,
    stage: "IT Setup",
  },
  {
    id: 3,
    name: "Alex Thompson",
    position: "Product Manager",
    department: "Product",
    startDate: "2023-04-22",
    avatar: "/placeholder.svg",
    initials: "AT",
    status: "Not Started",
    progress: 0,
    stage: "Pending",
  },
  {
    id: 4,
    name: "Sarah Lee",
    position: "HR Specialist",
    department: "Human Resources",
    startDate: "2023-04-25",
    avatar: "/placeholder.svg",
    initials: "SL",
    status: "Not Started",
    progress: 0,
    stage: "Pending",
  },
  {
    id: 5,
    name: "James Rodriguez",
    position: "Financial Analyst",
    department: "Finance",
    startDate: "2023-04-10",
    avatar: "/placeholder.svg",
    initials: "JR",
    status: "Completed",
    progress: 100,
    stage: "Completed",
  },
]

// Onboarding checklist items
const checklistItems = [
  { id: 1, title: "Personal Information", completed: true },
  { id: 2, title: "Employment Details", completed: true },
  { id: 3, title: "Documentation", completed: false },
  { id: 4, title: "IT Setup", completed: false },
  { id: 5, title: "Training", completed: false },
  { id: 6, title: "Department Introduction", completed: false },
  { id: 7, title: "First Week Schedule", completed: false },
]

export function EmployeeOnboarding() {
  const [selectedEmployee, setSelectedEmployee] = useState(onboardingEmployees[0])
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Employee Onboarding</h2>
          <p className="text-muted-foreground">Manage and track employee onboarding processes.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          New Onboarding
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Onboarding Employees</CardTitle>
            <CardDescription>Employees currently in the onboarding process</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {onboardingEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className={`flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    selectedEmployee.id === employee.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback>{employee.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{employee.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(employee.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{employee.position}</p>
                      <Badge
                        variant="outline"
                        className={`${
                          employee.status === "Completed"
                            ? "border-green-500 text-green-500"
                            : employee.status === "In Progress"
                              ? "border-blue-500 text-blue-500"
                              : "border-gray-500 text-gray-500"
                        }`}
                      >
                        {employee.status}
                      </Badge>
                    </div>
                    <Progress value={employee.progress} className="h-1 mt-2" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 p-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <UserPlus className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">New Employees</p>
                  <p className="text-muted-foreground">This month: 4</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardFooter>
        </Card>

        <div className="md:col-span-4 space-y-6">
          {selectedEmployee && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedEmployee.avatar} alt={selectedEmployee.name} />
                    <AvatarFallback>{selectedEmployee.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedEmployee.name}</CardTitle>
                    <CardDescription>
                      {selectedEmployee.position} • {selectedEmployee.department}
                    </CardDescription>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${
                        selectedEmployee.status === "Completed"
                          ? "border-green-500 text-green-500"
                          : selectedEmployee.status === "In Progress"
                            ? "border-blue-500 text-blue-500"
                            : "border-gray-500 text-gray-500"
                      }`}
                    >
                      {selectedEmployee.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-medium">{new Date(selectedEmployee.startDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Current Stage</p>
                        <p className="font-medium">{selectedEmployee.stage}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">{selectedEmployee.progress}%</p>
                      </div>
                    </div>
                    <Progress value={selectedEmployee.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="checklist">Checklist</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Onboarding Overview</CardTitle>
                      <CardDescription>Key information and progress</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input value={selectedEmployee.name} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input value={selectedEmployee.position} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Department</Label>
                          <Input value={selectedEmployee.department} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input value={selectedEmployee.startDate} readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Manager</Label>
                          <Input value="Jane Smith" readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input value="Headquarters" readOnly />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Recent Activities</h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-900/20">
                              <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Documentation Submitted</p>
                              <p className="text-xs text-muted-foreground">2 hours ago</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-900/20">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Personal Information Completed</p>
                              <p className="text-xs text-muted-foreground">1 day ago</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="mt-0.5 rounded-full bg-amber-100 p-1 dark:bg-amber-900/20">
                              <Clock className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Onboarding Process Started</p>
                              <p className="text-xs text-muted-foreground">2 days ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="checklist" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Onboarding Checklist</CardTitle>
                      <CardDescription>Track onboarding tasks and progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {checklistItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                  item.completed ? "bg-green-100 dark:bg-green-900/20" : "bg-gray-100 dark:bg-gray-800"
                                }`}
                              >
                                {item.completed ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{item.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.completed ? "Completed" : "Pending"}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" disabled={item.completed}>
                              {item.completed ? "Completed" : "Mark Complete"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 p-4">
                      <div className="flex w-full items-center justify-between">
                        <div className="text-sm">
                          <p className="font-medium">Overall Progress</p>
                          <p className="text-muted-foreground">
                            {checklistItems.filter((item) => item.completed).length} of {checklistItems.length} tasks
                            completed
                          </p>
                        </div>
                        <Button>Update Progress</Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Required Documents</CardTitle>
                      <CardDescription>Track document submission status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">ID Proof</p>
                              <p className="text-xs text-muted-foreground">Submitted on Apr 12, 2023</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Address Proof</p>
                              <p className="text-xs text-muted-foreground">Submitted on Apr 12, 2023</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Educational Certificates</p>
                              <p className="text-xs text-muted-foreground">Pending</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Upload
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Previous Employment Certificate</p>
                              <p className="text-xs text-muted-foreground">Pending</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Upload
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Bank Details</p>
                              <p className="text-xs text-muted-foreground">Pending</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Upload
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 p-4">
                      <div className="flex w-full items-center justify-between">
                        <div className="text-sm">
                          <p className="font-medium">Document Status</p>
                          <p className="text-muted-foreground">2 of 5 documents submitted</p>
                        </div>
                        <Button>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload All
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Onboarding Notes</CardTitle>
                      <CardDescription>Add notes and comments about the onboarding process</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="notes">Add Note</Label>
                          <Textarea id="notes" placeholder="Enter your notes here..." className="min-h-[100px]" />
                        </div>

                        <div className="space-y-4">
                          <div className="rounded-md border p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="/placeholder.svg" alt="Jane Smith" />
                                  <AvatarFallback>JS</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">Jane Smith</span>
                              </div>
                              <span className="text-xs text-muted-foreground">Apr 13, 2023</span>
                            </div>
                            <p className="mt-2 text-sm">
                              Michael has completed his initial paperwork. Still waiting on his educational certificates
                              and previous employment verification.
                            </p>
                          </div>

                          <div className="rounded-md border p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="/placeholder.svg" alt="Robert Johnson" />
                                  <AvatarFallback>RJ</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">Robert Johnson</span>
                              </div>
                              <span className="text-xs text-muted-foreground">Apr 11, 2023</span>
                            </div>
                            <p className="mt-2 text-sm">
                              IT setup is scheduled for April 14th. Laptop and access cards are ready for distribution.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/50 p-4">
                      <Button>Add Note</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Onboarding Templates</CardTitle>
          <CardDescription>Standardized onboarding processes for different roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">General Employee</h3>
                  <p className="text-xs text-muted-foreground">Standard onboarding process</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">7 steps • 14 days</span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Technical Roles</h3>
                  <p className="text-xs text-muted-foreground">For developers and engineers</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">9 steps • 21 days</span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Management</h3>
                  <p className="text-xs text-muted-foreground">For team leads and managers</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">12 steps • 30 days</span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-sm">
              <p className="font-medium">Custom Templates</p>
              <p className="text-muted-foreground">Create role-specific onboarding processes</p>
            </div>
            <Button variant="outline">Create Template</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

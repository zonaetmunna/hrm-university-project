"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  CheckCircle,
  Download,
  Edit,
  Eye,
  File,
  FileText,
  Filter,
  FolderPlus,
  Lock,
  MoreHorizontal,
  Search,
  Share2,
  Trash2,
  Upload,
  Users,
} from "lucide-react"
import { useState } from "react"

// Mock data for documents
const documents = [
  {
    id: 1,
    name: "Employee Handbook 2023.pdf",
    type: "PDF",
    size: "2.4 MB",
    category: "Policies",
    uploadedBy: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/placeholder.svg",
      initials: "JS",
    },
    uploadDate: "2023-03-15",
    access: "All Employees",
  },
  {
    id: 2,
    name: "Leave Policy.docx",
    type: "DOCX",
    size: "1.2 MB",
    category: "Policies",
    uploadedBy: {
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      avatar: "/placeholder.svg",
      initials: "RJ",
    },
    uploadDate: "2023-03-10",
    access: "All Employees",
  },
  {
    id: 3,
    name: "Salary Structure 2023.xlsx",
    type: "XLSX",
    size: "3.5 MB",
    category: "Finance",
    uploadedBy: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      avatar: "/placeholder.svg",
      initials: "ED",
    },
    uploadDate: "2023-04-05",
    access: "HR & Management",
  },
  {
    id: 4,
    name: "Onboarding Checklist.pdf",
    type: "PDF",
    size: "1.8 MB",
    category: "HR",
    uploadedBy: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/placeholder.svg",
      initials: "JS",
    },
    uploadDate: "2023-02-28",
    access: "HR Only",
  },
  {
    id: 5,
    name: "Company Calendar 2023.ics",
    type: "ICS",
    size: "0.5 MB",
    category: "General",
    uploadedBy: {
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      avatar: "/placeholder.svg",
      initials: "MW",
    },
    uploadDate: "2023-01-15",
    access: "All Employees",
  },
]

// Mock data for employee documents
const employeeDocuments = [
  {
    id: 1,
    employee: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg",
      initials: "JD",
    },
    documents: [
      {
        id: 101,
        name: "ID Proof.pdf",
        type: "PDF",
        size: "1.2 MB",
        uploadDate: "2023-03-15",
        status: "Verified",
      },
      {
        id: 102,
        name: "Address Proof.pdf",
        type: "PDF",
        size: "0.8 MB",
        uploadDate: "2023-03-15",
        status: "Verified",
      },
      {
        id: 103,
        name: "Education Certificate.pdf",
        type: "PDF",
        size: "2.1 MB",
        uploadDate: "2023-03-15",
        status: "Pending",
      },
    ],
  },
  {
    id: 2,
    employee: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/placeholder.svg",
      initials: "JS",
    },
    documents: [
      {
        id: 201,
        name: "ID Proof.pdf",
        type: "PDF",
        size: "1.5 MB",
        uploadDate: "2023-02-20",
        status: "Verified",
      },
      {
        id: 202,
        name: "Address Proof.pdf",
        type: "PDF",
        size: "0.9 MB",
        uploadDate: "2023-02-20",
        status: "Verified",
      },
      {
        id: 203,
        name: "Education Certificate.pdf",
        type: "PDF",
        size: "1.8 MB",
        uploadDate: "2023-02-20",
        status: "Verified",
      },
    ],
  },
]

export function DocumentManagement() {
  const [isUploadDocumentOpen, setIsUploadDocumentOpen] = useState(false)
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredDocuments =
    selectedCategory === "all"
      ? documents
      : documents.filter((doc) => doc.category.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Document Management</h2>
          <p className="text-muted-foreground">Manage and organize company and employee documents.</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>Create a new folder to organize your documents.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="folder-name" className="text-right">
                    Folder Name
                  </Label>
                  <Input id="folder-name" placeholder="e.g., HR Policies" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="folder-access" className="text-right">
                    Access Level
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      <SelectItem value="hr">HR Only</SelectItem>
                      <SelectItem value="management">Management Only</SelectItem>
                      <SelectItem value="hr-management">HR & Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateFolderOpen(false)}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isUploadDocumentOpen} onOpenChange={setIsUploadDocumentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>Upload a new document to the system.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="document-title" className="text-right">
                    Document Title
                  </Label>
                  <Input id="document-title" placeholder="e.g., Employee Handbook 2023" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="document-category" className="text-right">
                    Category
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="policies">Policies</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="document-access" className="text-right">
                    Access Level
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      <SelectItem value="hr">HR Only</SelectItem>
                      <SelectItem value="management">Management Only</SelectItem>
                      <SelectItem value="hr-management">HR & Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="document-file" className="text-right">
                    File
                  </Label>
                  <div className="col-span-3">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="document-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, PPTX (MAX. 10MB)</p>
                        </div>
                        <Input id="document-file" type="file" className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDocumentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsUploadDocumentOpen(false)}>Upload Document</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList>
          <TabsTrigger value="company">Company Documents</TabsTrigger>
          <TabsTrigger value="employee">Employee Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search documents..." />
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="policies">Policies</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{document.name}</div>
                          <div className="text-xs text-muted-foreground">{document.type}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{document.category}</TableCell>
                    <TableCell>{document.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={document.uploadedBy.avatar} alt={document.uploadedBy.name} />
                          <AvatarFallback>{document.uploadedBy.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{document.uploadedBy.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(document.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {document.access === "All Employees" ? (
                          <Users className="h-3 w-3" />
                        ) : document.access === "HR Only" ? (
                          <Lock className="h-3 w-3" />
                        ) : (
                          <Users className="h-3 w-3" />
                        )}
                        <span>{document.access}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="employee" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search employees..." />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {employeeDocuments.map((employee) => (
              <Card key={employee.id}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={employee.employee.avatar} alt={employee.employee.name} />
                    <AvatarFallback>{employee.employee.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{employee.employee.name}</CardTitle>
                    <CardDescription>{employee.employee.email}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employee.documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">{doc.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{doc.size}</TableCell>
                          <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`${
                                doc.status === "Verified"
                                  ? "border-green-500 text-green-500"
                                  : "border-amber-500 text-amber-500"
                              }`}
                            >
                              {doc.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                {doc.status === "Pending" && (
                                  <DropdownMenuItem>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                    Verify
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 p-4">
                  <div className="flex w-full items-center justify-between">
                    <div className="text-sm">
                      <p className="font-medium">Document Status</p>
                      <p className="text-muted-foreground">
                        {employee.documents.filter((doc) => doc.status === "Verified").length} of{" "}
                        {employee.documents.length} documents verified
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Document Categories</CardTitle>
            <CardDescription>Organize documents by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Policies</p>
                    <p className="text-xs text-muted-foreground">12 documents</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">HR</p>
                    <p className="text-xs text-muted-foreground">18 documents</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Finance</p>
                    <p className="text-xs text-muted-foreground">8 documents</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
                    <File className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">General</p>
                    <p className="text-xs text-muted-foreground">15 documents</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Recent document activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-900/20">
                  <Upload className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New document uploaded</p>
                  <p className="text-xs text-muted-foreground">Jane Smith uploaded &quot;Salary Structure 2023.xlsx&quot;</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-900/20">
                  <Eye className="h-4 w-4 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Document viewed</p>
                  <p className="text-xs text-muted-foreground">Robert Johnson viewed &quot;Employee Handbook 2023.pdf&quot;</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-full bg-amber-100 p-1 dark:bg-amber-900/20">
                  <Edit className="h-4 w-4 text-amber-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Document updated</p>
                  <p className="text-xs text-muted-foreground">Emily Davis updated &quot;Leave Policy.docx&quot;</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 rounded-full bg-red-100 p-1 dark:bg-red-900/20">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Document deleted</p>
                  <p className="text-xs text-muted-foreground">Michael Wilson deleted &quot;Old Policy.pdf&quot;</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <CardDescription>Document storage statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Total Storage</div>
                <div className="text-sm font-medium">245.8 MB / 5 GB</div>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div className="h-full w-[5%] rounded-full bg-primary"></div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span>PDF Documents</span>
                  </div>
                  <span>120.5 MB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span>Word Documents</span>
                  </div>
                  <span>45.2 MB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <span>Excel Spreadsheets</span>
                  </div>
                  <span>65.8 MB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    <span>Other Files</span>
                  </div>
                  <span>14.3 MB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

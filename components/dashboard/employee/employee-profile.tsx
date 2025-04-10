"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { Briefcase, Calendar, Edit, FileText, GraduationCap, Mail, MapPin, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Define TypeScript interfaces for our data
interface Education {
  degree: string;
  institution: string;
  year: string;
}

interface Experience {
  position: string;
  company: string;
  duration: string;
}

interface Document {
  name: string;
  type: string;
  size: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatar?: string;
  initials?: string;
  position?: string;
  department?: string;
  joinDate?: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  documents: Document[];
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

export function EmployeeProfile() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: ""
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  async function fetchProfileData() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/employee/profile")
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile data")
      }
      
      const data = await response.json()
      setProfileData(data)
      
      // Initialize form data with current profile values
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        bio: data.bio || ""
      })
      
      setIsLoading(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
      toast.error("Failed to load profile data")
      setIsLoading(false)
    }
  }

  async function handleProfileUpdate() {
    try {
      const response = await fetch("/api/employee/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error("Failed to update profile")
      }
      
      const updatedProfile = await response.json()
      
      // Update the profile data with the response
      setProfileData({
        ...profileData!,
        ...updatedProfile
      })
      
      setIsEditProfileOpen(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h3 className="text-xl font-medium">Error loading profile</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button onClick={fetchProfileData} className="mt-4">Try Again</Button>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return <div className="flex items-center justify-center h-screen">No profile data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
          <p className="text-muted-foreground">View and manage your personal information.</p>
        </div>
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 dark:bg-sidebar-primary dark:hover:bg-sidebar-primary/90">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Update your personal information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input 
                  id="email" 
                  value={formData.email} 
                  onChange={handleInputChange}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={handleInputChange}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Textarea 
                  id="bio" 
                  value={formData.bio} 
                  onChange={handleInputChange}
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleProfileUpdate} className="dark:bg-sidebar-primary dark:hover:bg-sidebar-primary/90">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-2 dark:border-border/30 dark:shadow-md dark:shadow-sidebar-primary/5">
          <CardHeader className="dark:bg-card/80">
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center dark:bg-card/60">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary/10 dark:border-sidebar-primary/30">
              <AvatarImage src={profileData.avatar} alt={profileData.name} />
              <AvatarFallback className="text-lg bg-primary/5 dark:bg-sidebar-primary/20">{profileData.initials}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-bold">{profileData.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{profileData.position}</p>

            <div className="w-full space-y-3 text-left">
              <div className="flex items-center gap-2">
                <div className="rounded-full p-1.5 bg-primary/5 dark:bg-sidebar-primary/20">
                  <Mail className="h-4 w-4 text-primary dark:text-sidebar-primary-foreground" />
                </div>
                <span className="text-sm">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full p-1.5 bg-primary/5 dark:bg-sidebar-primary/20">
                  <Phone className="h-4 w-4 text-primary dark:text-sidebar-primary-foreground" />
                </div>
                <span className="text-sm">{profileData.phone || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full p-1.5 bg-primary/5 dark:bg-sidebar-primary/20">
                  <MapPin className="h-4 w-4 text-primary dark:text-sidebar-primary-foreground" />
                </div>
                <span className="text-sm">{profileData.address || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full p-1.5 bg-primary/5 dark:bg-sidebar-primary/20">
                  <Briefcase className="h-4 w-4 text-primary dark:text-sidebar-primary-foreground" />
                </div>
                <span className="text-sm">{profileData.department || "Not assigned"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full p-1.5 bg-primary/5 dark:bg-sidebar-primary/20">
                  <Calendar className="h-4 w-4 text-primary dark:text-sidebar-primary-foreground" />
                </div>
                <span className="text-sm">
                  Joined {profileData.joinDate ? format(new Date(profileData.joinDate), "MMMM yyyy") : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-5 space-y-6">
          <Tabs defaultValue="education" className="w-full">
            <TabsList className="grid w-full grid-cols-4 dark:bg-muted/50">
              <TabsTrigger value="education" className="dark:data-[state=active]:bg-sidebar-primary dark:data-[state=active]:text-white">Education</TabsTrigger>
              <TabsTrigger value="experience" className="dark:data-[state=active]:bg-sidebar-primary dark:data-[state=active]:text-white">Experience</TabsTrigger>
              <TabsTrigger value="skills" className="dark:data-[state=active]:bg-sidebar-primary dark:data-[state=active]:text-white">Skills</TabsTrigger>
              <TabsTrigger value="documents" className="dark:data-[state=active]:bg-sidebar-primary dark:data-[state=active]:text-white">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="education" className="space-y-4 mt-4">
              <Card className="dark:border-border/30 dark:shadow-md dark:shadow-sidebar-primary/5">
                <CardHeader className="dark:bg-card/80">
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Your academic background</CardDescription>
                </CardHeader>
                <CardContent className="dark:bg-card/60">
                  <div className="space-y-6">
                    {profileData.education.map((edu: Education, index: number) => (
                      <div key={index} className="space-y-1 p-3 rounded-lg bg-primary/5 dark:bg-sidebar-primary/10">
                        <h4 className="text-base font-semibold">{edu.degree}</h4>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full p-1.5 bg-primary/10 dark:bg-sidebar-primary/20">
                            <GraduationCap className="h-4 w-4 text-primary dark:text-sidebar-primary-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">{edu.institution}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{edu.year}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="experience" className="space-y-4 mt-4">
              <Card className="dark:border-border/30 dark:shadow-md dark:shadow-sidebar-primary/5">
                <CardHeader className="dark:bg-card/80">
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Your professional background</CardDescription>
                </CardHeader>
                <CardContent className="dark:bg-card/60">
                  <div className="space-y-6">
                    {profileData.experience.map((exp: Experience, index: number) => (
                      <div key={index} className="space-y-1 p-3 rounded-lg bg-primary/5 dark:bg-sidebar-primary/10">
                        <h4 className="text-base font-semibold">{exp.position}</h4>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full p-1.5 bg-primary/10 dark:bg-sidebar-primary/20">
                            <Briefcase className="h-4 w-4 text-primary dark:text-sidebar-primary-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">{exp.company}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{exp.duration}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="skills" className="space-y-4 mt-4">
              <Card className="dark:border-border/30 dark:shadow-md dark:shadow-sidebar-primary/5">
                <CardHeader className="dark:bg-card/80">
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Your technical and professional skills</CardDescription>
                </CardHeader>
                <CardContent className="dark:bg-card/60">
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill: string, index: number) => (
                      <div
                        key={index}
                        className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary dark:bg-sidebar-primary/20 dark:text-sidebar-primary-foreground"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documents" className="space-y-4 mt-4">
              <Card className="dark:border-border/30 dark:shadow-md dark:shadow-sidebar-primary/5">
                <CardHeader className="dark:bg-card/80">
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Your important documents</CardDescription>
                </CardHeader>
                <CardContent className="dark:bg-card/60">
                  <div className="space-y-4">
                    {profileData.documents.map((doc: Document, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-primary/5 dark:bg-sidebar-primary/10">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full p-1.5 bg-primary/10 dark:bg-sidebar-primary/20">
                            <FileText className="h-4 w-4 text-primary dark:text-sidebar-primary-foreground" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{doc.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {doc.type} • {doc.size}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="dark:border-sidebar-primary/30 dark:text-sidebar-primary-foreground dark:hover:bg-sidebar-primary/10">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button variant="outline" className="w-full dark:border-sidebar-primary/30 dark:text-sidebar-primary-foreground dark:hover:bg-sidebar-primary/10">
                      Upload New Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

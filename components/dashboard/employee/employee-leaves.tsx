/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { differenceInCalendarDays, format } from "date-fns"
import { AlertCircle, Calendar as CalendarIcon, Check, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Define the form schema
const formSchema = z.object({
  type: z.string().min(1, "Leave type is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
})

type Leave = {
  id: string
  type: string
  startDate: Date
  endDate: Date
  status: string
  reason: string
  createdAt: Date
}

export function EmployeeLeaves() {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [leaveBalances, setLeaveBalances] = useState({
    annual: { total: 30, used: 0, remaining: 30 },
    sick: { total: 15, used: 0, remaining: 15 },
    personal: { total: 5, used: 0, remaining: 5 }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      reason: "",
    },
  })

  useEffect(() => {
    fetchLeaves()
  }, [])

  async function fetchLeaves() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/employee/leaves")
      
      if (!response.ok) {
        throw new Error("Failed to fetch leaves")
      }
      
      const data = await response.json()
      
      // Convert date strings to Date objects
      const formattedLeaves = data.leaves.map((leave: any) => ({
        ...leave,
        startDate: new Date(leave.startDate),
        endDate: new Date(leave.endDate),
        createdAt: new Date(leave.createdAt)
      }))
      
      setLeaves(formattedLeaves)
      setLeaveBalances(data.balances)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
      toast.error("Failed to load leave requests")
    } finally {
      setIsLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/employee/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to submit leave request")
      }

      await fetchLeaves()
      setIsFormOpen(false)
      form.reset()
      toast.success("Leave request submitted successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred")
    }
  }

  function getStatusBadge(status: string) {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-900/20">
            <Check className="mr-1 h-3 w-3" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 bg-red-50 dark:bg-red-900/20">
            <X className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge variant="outline" className="text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20">
            <AlertCircle className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
    }
  }

  function calculateDays(startDate: Date, endDate: Date) {
    return differenceInCalendarDays(endDate, startDate) + 1
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leave Requests</h2>
          <p className="text-muted-foreground">Manage your leave requests and balances</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Request Leave
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Annual Leave</CardTitle>
            <CardDescription>Your annual leave balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {leaveBalances.annual.remaining} days 
            </div>
            <p className="text-sm text-muted-foreground">
              Remaining from {leaveBalances.annual.total} days allowance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sick Leave</CardTitle>
            <CardDescription>Your sick leave balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {leaveBalances.sick.remaining} days
            </div>
            <p className="text-sm text-muted-foreground">
              Remaining from {leaveBalances.sick.total} days allowance
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Personal Leave</CardTitle>
            <CardDescription>Your personal leave balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {leaveBalances.personal.remaining} days
            </div>
            <p className="text-sm text-muted-foreground">
              Remaining from {leaveBalances.personal.total} days allowance
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Leave History</CardTitle>
          <CardDescription>View your leave request history and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {leaves.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No leave requests found. Use the &quot;Request Leave&quot; button to submit a new request.
              </p>
            ) : (
              leaves.map((leave) => (
                <div key={leave.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4">
                  <div className="space-y-1">
                    <div className="font-medium">{leave.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(leave.startDate, "PPP")} - {format(leave.endDate, "PPP")}
                      <span className="ml-2">({calculateDays(leave.startDate, leave.endDate)} days)</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Reason: {leave.reason}
                    </div>
                  </div>
                  <div className="flex items-center mt-2 sm:mt-0">
                    <div className="text-sm text-muted-foreground mr-4">
                      Requested on {format(leave.createdAt, "PPP")}
                    </div>
                    {getStatusBadge(leave.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
            <DialogDescription>Submit a new leave request for approval</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                        <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                        <SelectItem value="Bereavement Leave">Bereavement Leave</SelectItem>
                        <SelectItem value="Maternity/Paternity Leave">Maternity/Paternity Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => 
                              date < new Date() || 
                              (form.getValues("startDate") && date < form.getValues("startDate"))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide the reason for your leave request"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
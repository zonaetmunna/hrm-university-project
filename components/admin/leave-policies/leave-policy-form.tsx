"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LeavePolicy, useCreateLeavePolicy, useUpdateLeavePolicy } from "@/hooks/use-leave-policies"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  daysPerYear: z.coerce.number().int().min(1, "Days must be at least 1"),
  carryOverLimit: z.coerce.number().int().min(0, "Carry over limit must be at least 0"),
  minimumTenure: z.coerce.number().int().min(0, "Minimum tenure must be at least 0"),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface LeavePolicyFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  policy: LeavePolicy | null
}

export function LeavePolicyForm({
  open,
  onOpenChange,
  policy,
}: LeavePolicyFormProps) {
  // Query hooks
  const createLeavePolicy = useCreateLeavePolicy()
  const updateLeavePolicy = useUpdateLeavePolicy(policy?.id || "")
  
  const isLoading = createLeavePolicy.isPending || updateLeavePolicy.isPending

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      daysPerYear: 0,
      carryOverLimit: 0,
      minimumTenure: 0,
      description: "",
    },
  })

  // Reset form and populate with policy data when policy changes
  useEffect(() => {
    if (policy) {
      form.reset({
        name: policy.name,
        daysPerYear: policy.daysPerYear,
        carryOverLimit: policy.carryOverLimit,
        minimumTenure: policy.minimumTenure,
        description: policy.description || "",
      })
    } else {
      form.reset({
        name: "",
        daysPerYear: 0,
        carryOverLimit: 0,
        minimumTenure: 0,
        description: "",
      })
    }
  }, [policy, form])

  async function onSubmit(values: FormValues) {
    if (policy) {
      updateLeavePolicy.mutate(values, {
        onSuccess: () => {
          onOpenChange(false)
        }
      })
    } else {
      createLeavePolicy.mutate(values, {
        onSuccess: () => {
          onOpenChange(false)
        }
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {policy ? "Edit Leave Policy" : "Add Leave Policy"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Annual Leave" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="daysPerYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days Per Year</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormDescription>
                    Number of leave days allocated per year
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carryOverLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carry Over Limit</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormDescription>
                    Maximum number of days that can be carried over to the next year
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minimumTenure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Tenure (months)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormDescription>
                    Minimum employment duration in months before eligible for this leave
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter policy description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : policy ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 
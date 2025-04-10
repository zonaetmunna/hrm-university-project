/* eslint-disable react/no-unescaped-entities */
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useDepartments } from "@/hooks/use-departments"
import {
  SalaryStructure,
  useCreateSalaryStructure,
  useUpdateSalaryStructure
} from "@/hooks/use-salary-structures"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  baseSalary: z.coerce.number().int().min(1, "Base salary must be at least 1"),
  maxSalary: z.coerce.number().int().min(1, "Max salary must be at least 1"),
  bonusPercentage: z.coerce.number().int().min(0, "Bonus percentage must be at least 0").max(100, "Bonus percentage cannot exceed 100"),
  paymentFrequency: z.string().min(1, "Payment frequency is required"),
  allowances: z.string(),
  departmentId: z.string().min(1, "Department is required"),
})

type FormValues = z.infer<typeof formSchema>

interface SalaryStructureFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  structure: SalaryStructure | null
}

export function SalaryStructureForm({
  open,
  onOpenChange,
  structure,
}: SalaryStructureFormProps) {
  // Query hooks
  const createSalaryStructure = useCreateSalaryStructure()
  const updateSalaryStructure = useUpdateSalaryStructure(structure?.id || "")
  const { data: departments = [] } = useDepartments()
  
  const isLoading = createSalaryStructure.isPending || updateSalaryStructure.isPending

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      baseSalary: 0,
      maxSalary: 0,
      bonusPercentage: 0,
      paymentFrequency: "monthly",
      allowances: "",
      departmentId: "",
    },
  })

  // Reset form and populate with structure data when structure changes
  useEffect(() => {
    if (structure) {
      form.reset({
        name: structure.name,
        baseSalary: structure.baseSalary,
        maxSalary: structure.maxSalary,
        bonusPercentage: structure.bonusPercentage,
        paymentFrequency: structure.paymentFrequency,
        allowances: structure.allowances.join(", "),
        departmentId: structure.departmentId,
      })
    } else {
      form.reset({
        name: "",
        baseSalary: 0,
        maxSalary: 0,
        bonusPercentage: 0,
        paymentFrequency: "monthly",
        allowances: "",
        departmentId: "",
      })
    }
  }, [structure, form])

  async function onSubmit(values: FormValues) {
    // Convert allowances string to array
    const allowances = values.allowances
      ? values.allowances.split(",").map(item => item.trim()).filter(Boolean)
      : []

    const data = {
      ...values,
      allowances,
    }
    
    if (structure) {
      updateSalaryStructure.mutate(data, {
        onSuccess: () => {
          onOpenChange(false)
        }
      })
    } else {
      createSalaryStructure.mutate(data, {
        onSuccess: () => {
          onOpenChange(false)
        }
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {structure ? "Edit Salary Structure" : "Add Salary Structure"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Senior Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="baseSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Salary</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Salary</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bonusPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bonus Percentage</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} max={100} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Frequency</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="allowances"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowances</FormLabel>
                  <FormControl>
                    <Input placeholder="Transport, Housing, Phone" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma separated list of allowances (e.g., "Transport, Housing, Phone")
                  </FormDescription>
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
                {isLoading ? "Saving..." : structure ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 
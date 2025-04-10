import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Types
export interface SalaryStructure {
  id: string
  name: string
  baseSalary: number
  maxSalary: number
  bonusPercentage: number
  paymentFrequency: string
  allowances: string[]
  departmentId: string
  createdAt: string
  updatedAt: string
}

interface CreateSalaryStructureData {
  name: string
  baseSalary: number
  maxSalary?: number
  bonusPercentage?: number
  paymentFrequency?: string
  allowances?: string[]
  departmentId: string
}

// Fetch all salary structures
export function useSalaryStructures() {
  return useQuery({
    queryKey: ['salary-structures'],
    queryFn: async () => {
      const response = await fetch('/api/admin/salary-structures')
      if (!response.ok) {
        throw new Error('Failed to fetch salary structures')
      }
      return response.json() as Promise<SalaryStructure[]>
    }
  })
}

// Fetch a single salary structure by ID
export function useSalaryStructure(id: string) {
  return useQuery({
    queryKey: ['salary-structures', id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/salary-structures/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch salary structure')
      }
      return response.json() as Promise<SalaryStructure>
    },
    enabled: !!id
  })
}

// Create a new salary structure
export function useCreateSalaryStructure() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateSalaryStructureData) => {
      const response = await fetch('/api/admin/salary-structures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create salary structure')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate the salary structures query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['salary-structures'] })
      toast.success('Salary structure created successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create salary structure')
    }
  })
}

// Update a salary structure
export function useUpdateSalaryStructure(id: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateSalaryStructureData) => {
      const response = await fetch(`/api/admin/salary-structures/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update salary structure')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate both the collection and the individual item
      queryClient.invalidateQueries({ queryKey: ['salary-structures'] })
      queryClient.invalidateQueries({ queryKey: ['salary-structures', id] })
      toast.success('Salary structure updated successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update salary structure')
    }
  })
}

// Delete a salary structure
export function useDeleteSalaryStructure() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/salary-structures/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete salary structure')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-structures'] })
      toast.success('Salary structure deleted successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete salary structure')
    }
  })
} 
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Types
export interface LeavePolicy {
  id: string
  name: string
  daysPerYear: number
  carryOverLimit: number
  minimumTenure: number
  description: string | null
  createdAt: string
  updatedAt: string
}

interface CreateLeavePolicyData {
  name: string
  daysPerYear: number
  carryOverLimit?: number
  minimumTenure?: number
  description?: string
}

// Fetch all leave policies
export function useLeavePolicies() {
  return useQuery({
    queryKey: ['leave-policies'],
    queryFn: async () => {
      const response = await fetch('/api/admin/leave-policies')
      if (!response.ok) {
        throw new Error('Failed to fetch leave policies')
      }
      return response.json() as Promise<LeavePolicy[]>
    }
  })
}

// Fetch a single leave policy by ID
export function useLeavePolicy(id: string) {
  return useQuery({
    queryKey: ['leave-policies', id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/leave-policies/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch leave policy')
      }
      return response.json() as Promise<LeavePolicy>
    },
    enabled: !!id
  })
}

// Create a new leave policy
export function useCreateLeavePolicy() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateLeavePolicyData) => {
      const response = await fetch('/api/admin/leave-policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create leave policy')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate the leave policies query to refetch the data
      queryClient.invalidateQueries({ queryKey: ['leave-policies'] })
      toast.success('Leave policy created successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create leave policy')
    }
  })
}

// Update a leave policy
export function useUpdateLeavePolicy(id: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateLeavePolicyData) => {
      const response = await fetch(`/api/admin/leave-policies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update leave policy')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate both the collection and the individual item
      queryClient.invalidateQueries({ queryKey: ['leave-policies'] })
      queryClient.invalidateQueries({ queryKey: ['leave-policies', id] })
      toast.success('Leave policy updated successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update leave policy')
    }
  })
}

// Delete a leave policy
export function useDeleteLeavePolicy() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/leave-policies/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete leave policy')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-policies'] })
      toast.success('Leave policy deleted successfully')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete leave policy')
    }
  })
} 
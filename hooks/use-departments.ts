import { useQuery } from '@tanstack/react-query'

// Types
export interface Department {
  id: string
  name: string
  description: string | null
  employeeCount: number
}

// Fetch all departments
export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const response = await fetch('/api/admin/departments')
      if (!response.ok) {
        throw new Error('Failed to fetch departments')
      }
      return response.json() as Promise<Department[]>
    }
  })
} 
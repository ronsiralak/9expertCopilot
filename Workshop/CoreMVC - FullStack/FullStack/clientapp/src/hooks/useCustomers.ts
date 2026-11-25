import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customerService } from '../services/customerService'
import type { CustomerInput } from '../types/customer'

export function useCustomers(search: string) {
  return useQuery({ queryKey: ['customers', search], queryFn: () => customerService.search(search) })
}

export function useCustomer(id: string | undefined) {
  return useQuery({ queryKey: ['customer', id], queryFn: () => customerService.get(id!), enabled: !!id })
}

export function useSaveCustomer(id: string | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CustomerInput) => id ? customerService.update(id, input) : customerService.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['customers'] })
      if (id) await queryClient.invalidateQueries({ queryKey: ['customer', id] })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: customerService.delete,
    onSuccess: async (_result, id) => {
      queryClient.removeQueries({ queryKey: ['customer', id] })
      await queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

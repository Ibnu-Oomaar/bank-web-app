import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/utils/api-fetcher'

// --- Wallet & Ledger ---
export const useWallet = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => apiFetch<{ balance: number, history: any[] }>('/api/wallet'),
  })
}

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const data = await apiFetch<{ balance: number, history: any[] }>('/api/wallet?history=true')
      return data.history || []
    },
  })
}

export const useTransferMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { toWalletId: string, amount: number, note?: string }) => 
      apiFetch('/api/wallet', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    }
  })
}

export const useDepositMutation = () => {
  return useMutation({
    mutationFn: (data: { amount: number, currency?: string }) => 
      apiFetch('/api/payments/deposit', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}

// --- Loans ---
export const useLoans = () => {
  return useQuery({
    queryKey: ['loans'],
    queryFn: () => apiFetch<any[]>('/api/loans'),
  })
}

export const useLoanProducts = () => {
  return useQuery({
    queryKey: ['loan-products'],
    queryFn: () => apiFetch<any[]>('/api/loans/products'),
  })
}

export const useApplyLoanMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { productId: string, amount: number, termMonths: number }) => 
      apiFetch('/api/loans', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
    }
  })
}

// --- Notifications ---
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiFetch<any[]>('/api/notifications'),
  })
}

// --- Admin ---
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => apiFetch<any>('/api/admin/stats'),
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      return await apiFetch<any[]>('/api/admin/users')
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return await apiFetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}


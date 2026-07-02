import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { usersApi } from '@/api/users'
import { queryKeys } from '../queries/queryKeys'
import { getApiErrorMessage } from '@/api/client'
import type { UserRequest } from '@/api/types'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserRequest) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() })
      toast.success('Usuário criado')
    },
    onError: (error) => {
      toast.error('Erro ao criar usuário', { description: getApiErrorMessage(error) })
    },
  })
}

export function useDeactivateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.list() })
      toast.success('Usuário desativado')
    },
    onError: (error) => {
      toast.error('Erro ao desativar usuário', { description: getApiErrorMessage(error) })
    },
  })
}

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { professionalsApi } from '@/api/professionals'
import { queryKeys } from '../queries/queryKeys'
import { getApiErrorMessage } from '@/api/client'
import type { ProfessionalRequest } from '@/api/types'

export function useCreateProfessional() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProfessionalRequest) => professionalsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.professionals.list() })
      toast.success('Profissional cadastrado')
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar profissional', { description: getApiErrorMessage(error) })
    },
  })
}

export function useUpdateProfessional() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProfessionalRequest }) =>
      professionalsApi.update(id, data),
    onSuccess: (professional) => {
      queryClient.setQueryData(queryKeys.professionals.detail(professional.id), professional)
      queryClient.invalidateQueries({ queryKey: queryKeys.professionals.list() })
      toast.success('Profissional atualizado')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar profissional', { description: getApiErrorMessage(error) })
    },
  })
}

export function useDeactivateProfessional() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => professionalsApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.professionals.list() })
      toast.success('Profissional desativado')
    },
    onError: (error) => {
      toast.error('Erro ao desativar profissional', { description: getApiErrorMessage(error) })
    },
  })
}

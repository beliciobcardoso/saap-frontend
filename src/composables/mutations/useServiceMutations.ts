import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { servicesApi } from '@/api/services'
import { queryKeys } from '../queries/queryKeys'
import { getApiErrorMessage } from '@/api/client'
import type { ServiceRequest } from '@/api/types'

export function useCreateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ServiceRequest) => servicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.list() })
      toast.success('Serviço cadastrado')
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar serviço', { description: getApiErrorMessage(error) })
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceRequest }) =>
      servicesApi.update(id, data),
    onSuccess: (service) => {
      queryClient.setQueryData(queryKeys.services.detail(service.id), service)
      queryClient.invalidateQueries({ queryKey: queryKeys.services.list() })
      toast.success('Serviço atualizado')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar serviço', { description: getApiErrorMessage(error) })
    },
  })
}

export function useDeactivateService() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => servicesApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.list() })
      toast.success('Serviço desativado')
    },
    onError: (error) => {
      toast.error('Erro ao desativar serviço', { description: getApiErrorMessage(error) })
    },
  })
}

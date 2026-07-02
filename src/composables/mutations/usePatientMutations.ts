import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { patientsApi } from '@/api/patients'
import { queryKeys } from '../queries/queryKeys'
import { getApiErrorMessage } from '@/api/client'
import type { PatientRequest } from '@/api/types'

export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PatientRequest) => patientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.list() })
      toast.success('Paciente cadastrado')
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar paciente', { description: getApiErrorMessage(error) })
    },
  })
}

export function useUpdatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PatientRequest }) =>
      patientsApi.update(id, data),
    onSuccess: (patient) => {
      queryClient.setQueryData(queryKeys.patients.detail(patient.id), patient)
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.list() })
      toast.success('Paciente atualizado')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar paciente', { description: getApiErrorMessage(error) })
    },
  })
}

export function useDeactivatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => patientsApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.patients.list() })
      toast.success('Paciente desativado')
    },
    onError: (error) => {
      toast.error('Erro ao desativar paciente', { description: getApiErrorMessage(error) })
    },
  })
}

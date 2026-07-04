import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { medicalRecordsApi } from '@/api/medicalRecords'
import { getApiErrorMessage } from '@/api/client'
import type { CreateMedicalRecordEntryRequest, UpdateMedicalRecordEntryRequest } from '@/api/types'

export function useCreateMedicalRecordEntry(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMedicalRecordEntryRequest) => medicalRecordsApi.createEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records', patientId] })
      toast.success('Evolução clínica registrada')
    },
    onError: (error) => {
      toast.error('Erro ao registrar evolução', { description: getApiErrorMessage(error) })
    },
  })
}

export function useUpdateMedicalRecordEntry(patientId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ entryId, data }: { entryId: string; data: UpdateMedicalRecordEntryRequest }) =>
      medicalRecordsApi.updateEntry(entryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records', patientId] })
      toast.success('Evolução clínica atualizada')
    },
    onError: (error) => {
      toast.error('Erro ao atualizar evolução', { description: getApiErrorMessage(error) })
    },
  })
}

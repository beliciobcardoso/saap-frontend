import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { Ref } from 'vue'
import { patientsApi } from '@/api/patients'
import { queryKeys } from './queryKeys'

export function usePatients() {
  return useQuery({
    queryKey: queryKeys.patients.list(),
    queryFn: patientsApi.list,
    staleTime: 5 * 60 * 1000,
  })
}

export function usePatient(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.patients.detail(id.value)),
    queryFn: () => patientsApi.get(id.value),
    enabled: computed(() => !!id.value),
  })
}

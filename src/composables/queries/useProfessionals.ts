import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { Ref } from 'vue'
import { professionalsApi } from '@/api/professionals'
import { queryKeys } from './queryKeys'

export function useProfessionals() {
  return useQuery({
    queryKey: queryKeys.professionals.list(),
    queryFn: professionalsApi.list,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProfessional(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.professionals.detail(id.value)),
    queryFn: () => professionalsApi.get(id.value),
    enabled: computed(() => !!id.value),
  })
}

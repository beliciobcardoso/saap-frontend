import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { Ref } from 'vue'
import { servicesApi } from '@/api/services'
import { queryKeys } from './queryKeys'

export function useServices() {
  return useQuery({
    queryKey: queryKeys.services.list(),
    queryFn: servicesApi.list,
    staleTime: 5 * 60 * 1000,
  })
}

export function useService(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.services.detail(id.value)),
    queryFn: () => servicesApi.get(id.value),
    enabled: computed(() => !!id.value),
  })
}

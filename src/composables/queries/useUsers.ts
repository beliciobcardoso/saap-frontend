import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { Ref } from 'vue'
import { usersApi } from '@/api/users'
import { queryKeys } from './queryKeys'

export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: usersApi.list,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUser(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.users.detail(id.value)),
    queryFn: () => usersApi.get(id.value),
    enabled: computed(() => !!id.value),
  })
}

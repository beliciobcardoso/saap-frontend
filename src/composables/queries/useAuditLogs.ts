import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { Ref } from 'vue'
import { auditApi } from '@/api/audit'
import { queryKeys } from './queryKeys'
import type { AuditLogFilters } from '@/api/types'

export function useAuditLogs(filters?: Ref<AuditLogFilters>) {
  return useQuery({
    queryKey: computed(() => queryKeys.audit.list(filters?.value)),
    queryFn: () => auditApi.list(filters?.value),
    staleTime: 60 * 1000,
  })
}

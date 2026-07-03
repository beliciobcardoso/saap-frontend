import { apiClient } from './client'
import type { AuditLogResponse, AuditLogFilters } from './types'

export const auditApi = {
  list: (filters?: AuditLogFilters) =>
    apiClient.get<AuditLogResponse[]>('/api/v1/audit-logs', { params: filters }).then(r => r.data),
}

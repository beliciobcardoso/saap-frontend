import type { AppointmentFilters, AuditLogFilters } from '@/api/types'

export const queryKeys = {
  patients: {
    all: ['patients'] as const,
    lists: () => [...queryKeys.patients.all, 'list'] as const,
    list: () => [...queryKeys.patients.lists()] as const,
    details: () => [...queryKeys.patients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.patients.details(), id] as const,
  },

  professionals: {
    all: ['professionals'] as const,
    list: () => [...queryKeys.professionals.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.professionals.all, 'detail', id] as const,
  },

  services: {
    all: ['services'] as const,
    list: () => [...queryKeys.services.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.services.all, 'detail', id] as const,
  },

  users: {
    all: ['users'] as const,
    list: () => [...queryKeys.users.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },

  appointments: {
    all: ['appointments'] as const,
    lists: () => [...queryKeys.appointments.all, 'list'] as const,
    list: (filters?: AppointmentFilters) =>
      [...queryKeys.appointments.lists(), filters] as const,
    details: () => [...queryKeys.appointments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.appointments.details(), id] as const,
    queue: (date: string) => [...queryKeys.appointments.all, 'queue', date] as const,
  },

  audit: {
    all: ['audit-logs'] as const,
    list: (filters?: AuditLogFilters) =>
      [...queryKeys.audit.all, 'list', filters] as const,
  },
}

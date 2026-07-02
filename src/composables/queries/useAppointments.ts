import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { Ref } from 'vue'
import { appointmentsApi } from '@/api/appointments'
import { queryKeys } from './queryKeys'
import type { AppointmentFilters } from '@/api/types'

export function useAppointments(filters?: Ref<AppointmentFilters>) {
  return useQuery({
    queryKey: computed(() => queryKeys.appointments.list(filters?.value)),
    queryFn: () => appointmentsApi.list(filters?.value),
    staleTime: 30 * 1000,
  })
}

export function useAppointment(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => queryKeys.appointments.detail(id.value)),
    queryFn: () => appointmentsApi.get(id.value),
    enabled: computed(() => !!id.value),
  })
}

export function useTodayQueue(professionalId: Ref<string | undefined>) {
  const today = new Date().toISOString().split('T')[0]

  return useQuery({
    queryKey: computed(() => queryKeys.appointments.queue(today)),
    queryFn: () => appointmentsApi.list({
      professionalId: professionalId.value,
      startDate: `${today}T00:00:00`,
      endDate: `${today}T23:59:59`,
    }),
    refetchInterval: 10_000,
    staleTime: 0,
  })
}

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { appointmentsApi } from '@/api/appointments'
import { queryKeys } from '../queries/queryKeys'
import { getApiErrorMessage } from '@/api/client'
import type {
  BookAppointmentRequest,
  CancelAppointmentRequest,
  CheckInRequest,
} from '@/api/types'

export function useBookAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BookAppointmentRequest) => appointmentsApi.book(data),
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
      toast.success('Agendamento criado', {
        description: `${appointment.patient.name} — ${appointment.service.name}`,
      })
    },
    onError: (error) => {
      toast.error('Erro ao agendar', { description: getApiErrorMessage(error) })
    },
  })
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.confirm(id),
    onSuccess: (appointment) => {
      queryClient.setQueryData(
        queryKeys.appointments.detail(appointment.id),
        appointment
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
      toast.success('Agendamento confirmado')
    },
    onError: (error) => {
      toast.error('Erro ao confirmar', { description: getApiErrorMessage(error) })
    },
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CancelAppointmentRequest }) =>
      appointmentsApi.cancel(id, data),
    onSuccess: (appointment) => {
      queryClient.setQueryData(
        queryKeys.appointments.detail(appointment.id),
        appointment
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
      toast.success('Agendamento cancelado')
    },
    onError: (error) => {
      toast.error('Erro ao cancelar', { description: getApiErrorMessage(error) })
    },
  })
}

export function useCheckIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CheckInRequest }) =>
      appointmentsApi.checkIn(id, data),
    onSuccess: (appointment) => {
      queryClient.setQueryData(
        queryKeys.appointments.detail(appointment.id),
        appointment
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
      toast.success('Check-in realizado', {
        description: `Prioridade verificada: ${appointment.verifiedPriority}`,
      })
    },
    onError: (error) => {
      toast.error('Erro no check-in', { description: getApiErrorMessage(error) })
    },
  })
}

export function useCallNext() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.callNext(id),
    onSuccess: (appointment) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
      toast.success(`Chamando: ${appointment.patient.name}`, {
        description: `Prioridade ${appointment.verifiedPriority}`,
        duration: 8000,
      })
    },
    onError: (error) => {
      toast.error('Erro ao chamar próximo', { description: getApiErrorMessage(error) })
    },
  })
}

export function useStartAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.start(id),
    onSuccess: (appointment) => {
      queryClient.setQueryData(
        queryKeys.appointments.detail(appointment.id),
        appointment
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
      toast.success('Atendimento iniciado')
    },
    onError: (error) => {
      toast.error('Erro ao iniciar atendimento', { description: getApiErrorMessage(error) })
    },
  })
}

export function useCompleteAppointment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.complete(id),
    onSuccess: (appointment) => {
      queryClient.setQueryData(
        queryKeys.appointments.detail(appointment.id),
        appointment
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() })
      toast.success('Atendimento finalizado')
    },
    onError: (error) => {
      toast.error('Erro ao finalizar', { description: getApiErrorMessage(error) })
    },
  })
}

import { apiClient } from './client'
import type {
  AppointmentResponse,
  BookAppointmentRequest,
  CancelAppointmentRequest,
  CheckInRequest,
  AppointmentFilters,
} from './types'

export const appointmentsApi = {
  list: (filters?: AppointmentFilters) =>
    apiClient.get<AppointmentResponse[]>('/api/v1/appointments', { params: filters }).then(r => r.data),
  get: (id: string) =>
    apiClient.get<AppointmentResponse>(`/api/v1/appointments/${id}`).then(r => r.data),
  book: (data: BookAppointmentRequest) =>
    apiClient.post<AppointmentResponse>('/api/v1/appointments', data).then(r => r.data),
  confirm: (id: string) =>
    apiClient.put<AppointmentResponse>(`/api/v1/appointments/${id}/confirm`).then(r => r.data),
  cancel: (id: string, data: CancelAppointmentRequest) =>
    apiClient.put<AppointmentResponse>(`/api/v1/appointments/${id}/cancel`, data).then(r => r.data),
  checkIn: (id: string, data: CheckInRequest) =>
    apiClient.put<AppointmentResponse>(`/api/v1/appointments/${id}/check-in`, data).then(r => r.data),
  start: (id: string) =>
    apiClient.put<AppointmentResponse>(`/api/v1/appointments/${id}/start`).then(r => r.data),
  callNext: (id: string) =>
    apiClient.put<AppointmentResponse>(`/api/v1/appointments/${id}/call-next`).then(r => r.data),
  complete: (id: string) =>
    apiClient.put<AppointmentResponse>(`/api/v1/appointments/${id}/complete`).then(r => r.data),
  publicConfirm: (token: string) =>
    apiClient.post<AppointmentResponse>('/api/v1/appointments/public/confirm', null, { params: { token } }).then(r => r.data),
  publicCancel: (token: string) =>
    apiClient.post<AppointmentResponse>('/api/v1/appointments/public/cancel', null, { params: { token } }).then(r => r.data),
}

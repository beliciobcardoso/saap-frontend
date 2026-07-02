import { apiClient } from './client'
import type { ServiceResponse, ServiceRequest } from './types'

export const servicesApi = {
  list: () =>
    apiClient.get<ServiceResponse[]>('/services').then(r => r.data),
  get: (id: string) =>
    apiClient.get<ServiceResponse>(`/services/${id}`).then(r => r.data),
  create: (data: ServiceRequest) =>
    apiClient.post<ServiceResponse>('/services', data).then(r => r.data),
  update: (id: string, data: ServiceRequest) =>
    apiClient.put<ServiceResponse>(`/services/${id}`, data).then(r => r.data),
  deactivate: (id: string) =>
    apiClient.delete(`/services/${id}`),
}

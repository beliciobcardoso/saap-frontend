import { apiClient } from './client'
import type { ServiceResponse, ServiceRequest } from './types'

export const servicesApi = {
  list: () =>
    apiClient.get<ServiceResponse[]>('/api/v1/services').then(r => r.data),
  get: (id: string) =>
    apiClient.get<ServiceResponse>(`/api/v1/services/${id}`).then(r => r.data),
  create: (data: ServiceRequest) =>
    apiClient.post<ServiceResponse>('/api/v1/services', data).then(r => r.data),
  update: (id: string, data: ServiceRequest) =>
    apiClient.put<ServiceResponse>(`/api/v1/services/${id}`, data).then(r => r.data),
  deactivate: (id: string) =>
    apiClient.delete(`/api/v1/services/${id}`),
}

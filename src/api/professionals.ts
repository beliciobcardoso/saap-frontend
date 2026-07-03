import { apiClient } from './client'
import type { ProfessionalResponse, ProfessionalRequest } from './types'

export const professionalsApi = {
  list: () =>
    apiClient.get<ProfessionalResponse[]>('/api/v1/professionals').then(r => r.data),
  get: (id: string) =>
    apiClient.get<ProfessionalResponse>(`/api/v1/professionals/${id}`).then(r => r.data),
  create: (data: ProfessionalRequest) =>
    apiClient.post<ProfessionalResponse>('/api/v1/professionals', data).then(r => r.data),
  update: (id: string, data: ProfessionalRequest) =>
    apiClient.put<ProfessionalResponse>(`/api/v1/professionals/${id}`, data).then(r => r.data),
  deactivate: (id: string) =>
    apiClient.delete(`/api/v1/professionals/${id}`),
}

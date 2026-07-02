import { apiClient } from './client'
import type { ProfessionalResponse, ProfessionalRequest } from './types'

export const professionalsApi = {
  list: () =>
    apiClient.get<ProfessionalResponse[]>('/professionals').then(r => r.data),
  get: (id: string) =>
    apiClient.get<ProfessionalResponse>(`/professionals/${id}`).then(r => r.data),
  create: (data: ProfessionalRequest) =>
    apiClient.post<ProfessionalResponse>('/professionals', data).then(r => r.data),
  update: (id: string, data: ProfessionalRequest) =>
    apiClient.put<ProfessionalResponse>(`/professionals/${id}`, data).then(r => r.data),
  deactivate: (id: string) =>
    apiClient.delete(`/professionals/${id}`),
}

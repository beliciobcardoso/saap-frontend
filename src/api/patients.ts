import { apiClient } from './client'
import type { PatientResponse, PatientRequest } from './types'

export const patientsApi = {
  list: () =>
    apiClient.get<PatientResponse[]>('/api/v1/patients').then(r => r.data),
  get: (id: string) =>
    apiClient.get<PatientResponse>(`/api/v1/patients/${id}`).then(r => r.data),
  create: (data: PatientRequest) =>
    apiClient.post<PatientResponse>('/api/v1/patients', data).then(r => r.data),
  update: (id: string, data: PatientRequest) =>
    apiClient.put<PatientResponse>(`/api/v1/patients/${id}`, data).then(r => r.data),
  deactivate: (id: string) =>
    apiClient.delete(`/api/v1/patients/${id}`),
}

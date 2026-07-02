import { apiClient } from './client'
import type { PatientResponse, PatientRequest } from './types'

export const patientsApi = {
  list: () =>
    apiClient.get<PatientResponse[]>('/patients').then(r => r.data),
  get: (id: string) =>
    apiClient.get<PatientResponse>(`/patients/${id}`).then(r => r.data),
  create: (data: PatientRequest) =>
    apiClient.post<PatientResponse>('/patients', data).then(r => r.data),
  update: (id: string, data: PatientRequest) =>
    apiClient.put<PatientResponse>(`/patients/${id}`, data).then(r => r.data),
  deactivate: (id: string) =>
    apiClient.delete(`/patients/${id}`),
}

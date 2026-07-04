import { apiClient } from './client'
import type {
  MedicalRecordResponse,
  CreateMedicalRecordEntryRequest,
  UpdateMedicalRecordEntryRequest,
} from './types'

export const medicalRecordsApi = {
  getByPatient: (patientId: string) =>
    apiClient.get<MedicalRecordResponse>(`/api/v1/medical-records/patients/${patientId}`).then(r => r.data),

  createEntry: (data: CreateMedicalRecordEntryRequest) =>
    apiClient.post('/api/v1/medical-records/entries', data).then(r => r.data),

  updateEntry: (entryId: string, data: UpdateMedicalRecordEntryRequest) =>
    apiClient.put(`/api/v1/medical-records/entries/${entryId}`, data).then(r => r.data),
}

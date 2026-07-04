import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { medicalRecordsApi } from '@/api/medicalRecords'
import { queryKeys } from './queryKeys'

export function useMedicalRecord(patientId: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['medical-records', patientId.value]),
    queryFn: () => medicalRecordsApi.getByPatient(patientId.value),
    enabled: computed(() => !!patientId.value),
  })
}

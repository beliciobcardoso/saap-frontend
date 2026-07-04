import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermissions() {
  const authStore = useAuthStore()
  const role = computed(() => authStore.userRole)

  return {
    canManagePatients: computed(() =>
      ['ADMIN', 'RECEPTIONIST'].includes(role.value ?? '')),

    canBook: computed(() =>
      ['ADMIN', 'RECEPTIONIST'].includes(role.value ?? '')),

    canStartAppointment: computed(() =>
      ['ADMIN', 'PROFESSIONAL'].includes(role.value ?? '')),
    canCallNext: computed(() =>
      ['ADMIN', 'PROFESSIONAL'].includes(role.value ?? '')),
    canComplete: computed(() =>
      ['ADMIN', 'PROFESSIONAL'].includes(role.value ?? '')),

    canManageUsers: computed(() => role.value === 'ADMIN'),
    canManageProfessionals: computed(() => role.value === 'ADMIN'),
    canManageServices: computed(() => role.value === 'ADMIN'),
    canViewAuditLogs: computed(() => role.value === 'ADMIN'),

    canManageMedicalRecords: computed(() =>
      ['ADMIN', 'PROFESSIONAL'].includes(role.value ?? '')),

    canConfirm: computed(() =>
      ['ADMIN', 'RECEPTIONIST'].includes(role.value ?? '')),

    isAdmin: computed(() => role.value === 'ADMIN'),
    isReceptionist: computed(() => role.value === 'RECEPTIONIST'),
    isProfessional: computed(() => role.value === 'PROFESSIONAL'),
  }
}

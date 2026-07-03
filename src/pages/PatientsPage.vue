<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePatients } from '@/composables/queries/usePatients'
import { useDeactivatePatient } from '@/composables/mutations/usePatientMutations'
import { usePermissions } from '@/composables/usePermissions'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import PatientForm from '@/components/patients/PatientForm.vue'
import AppErrorBoundary from '@/components/ui/AppErrorBoundary.vue'
import { formatCpf, formatPhone, formatDate } from '@/lib/formatters'
import { PhPlus, PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { PatientResponse } from '@/api/types'

const { canManagePatients } = usePermissions()
const { data: patients, isLoading, isError, refetch } = usePatients()
const deactivateMutation = useDeactivatePatient()

const searchQuery = ref('')
const showFormModal = ref(false)
const editingPatient = ref<PatientResponse | null>(null)
const showDeactivateDialog = ref(false)
const deactivatingPatient = ref<PatientResponse | null>(null)

const columns = [
  { key: 'name', label: 'Nome' },
  { key: 'cpf', label: 'CPF' },
  { key: 'phone', label: 'Telefone' },
  { key: 'email', label: 'Email' },
  { key: 'birthDate', label: 'Data Nasc.' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Ações', class: 'text-right' },
]

const filteredPatients = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return patients.value ?? []
  return (patients.value ?? []).filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.cpf.includes(q) ||
      p.phone.includes(q) ||
      (p.email && p.email.toLowerCase().includes(q))
  )
})

function openCreate() {
  editingPatient.value = null
  showFormModal.value = true
}

function openEdit(patient: PatientResponse) {
  editingPatient.value = patient
  showFormModal.value = true
}

function handleDeactivate(patient: PatientResponse) {
  deactivatingPatient.value = patient
  showDeactivateDialog.value = true
}

function confirmDeactivate() {
  if (!deactivatingPatient.value) return
  deactivateMutation.mutate(deactivatingPatient.value.id, {
    onSuccess: () => { showDeactivateDialog.value = false },
  })
}
</script>

<template>
  <div class="page">
    <AppErrorBoundary v-if="isError" @retry="refetch" />
    <template v-else>
    <div class="page__header">
      <h1 class="page__title">Pacientes</h1>
      <AppButton v-if="canManagePatients" @click="openCreate">
        <PhPlus :size="16" />
        Novo Paciente
      </AppButton>
    </div>

    <div class="page__search">
      <PhMagnifyingGlass :size="16" class="search-icon" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar paciente por nome, CPF, telefone ou email..."
        class="search-input"
      />
    </div>

    <AppTable :columns="columns" :loading="isLoading" empty="Nenhum paciente encontrado.">
      <tr v-for="patient in filteredPatients" :key="patient.id">
        <td>
          <span class="cell-primary">{{ patient.name }}</span>
        </td>
        <td class="cell-mono">{{ formatCpf(patient.cpf) }}</td>
        <td class="cell-mono">{{ formatPhone(patient.phone) }}</td>
        <td>{{ patient.email || '—' }}</td>
        <td class="cell-mono">{{ formatDate(patient.birthDate) }}</td>
        <td>
          <span :class="['status-dot', patient.active ? 'status-dot--active' : 'status-dot--inactive']">
            {{ patient.active ? 'Ativo' : 'Inativo' }}
          </span>
        </td>
        <td class="cell-actions">
          <div class="row-actions">
            <AppButton v-if="canManagePatients" size="xs" variant="ghost" @click="openEdit(patient)">Editar</AppButton>
            <AppButton v-if="canManagePatients && patient.active" size="xs" variant="ghost" @click="handleDeactivate(patient)">Desativar</AppButton>
          </div>
        </td>
      </tr>
    </AppTable>

    <PatientForm v-model="showFormModal" :patient="editingPatient" />

    <ConfirmDialog
      v-model="showDeactivateDialog"
      title="Desativar paciente"
      :message="`Tem certeza que deseja desativar o paciente ${deactivatingPatient?.name}?`"
      confirm-label="Desativar"
      variant="danger"
      :loading="deactivateMutation.isPending.value"
      @confirm="confirmDeactivate"
    />
    </template>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.page__search {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-neutral-400);
}

.search-input {
  width: 100%;
  padding: var(--space-2) var(--space-3) var(--space-2) var(--space-10);
  font-size: var(--text-sm);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15);
}

.cell-primary {
  font-weight: var(--font-medium);
  color: var(--color-neutral-900);
}

.cell-mono {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.cell-actions {
  text-align: right;
}

.row-actions {
  display: flex;
  gap: var(--space-1);
  justify-content: flex-end;
}

.status-dot {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.status-dot::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
}

.status-dot--active::before {
  background: var(--color-success-500);
}

.status-dot--active {
  color: var(--color-success-700);
}

.status-dot--inactive::before {
  background: var(--color-neutral-400);
}

.status-dot--inactive {
  color: var(--color-neutral-500);
}
</style>

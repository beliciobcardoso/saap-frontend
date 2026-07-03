<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAppointments } from '@/composables/queries/useAppointments'
import { useProfessionals } from '@/composables/queries/useProfessionals'
import { useCancelAppointment } from '@/composables/mutations/useAppointmentMutations'
import { usePermissions } from '@/composables/usePermissions'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import AppErrorBoundary from '@/components/ui/AppErrorBoundary.vue'
import PriorityBadge from '@/components/shared/PriorityBadge.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import BookAppointmentForm from '@/components/appointments/BookAppointmentForm.vue'
import AppointmentActions from '@/components/appointments/AppointmentActions.vue'
import { formatDateTime, formatCpf } from '@/lib/formatters'
import { useRouter } from 'vue-router'
import type { AppointmentFilters, AppointmentResponse } from '@/api/types'
import { PhPlus, PhFunnel } from '@phosphor-icons/vue'

const router = useRouter()
const { canBook } = usePermissions()

const showBookModal = ref(false)
const showCancelDialog = ref(false)
const cancellingId = ref('')
const cancelReason = ref('')

const filters = ref<AppointmentFilters>({})
const showFilters = ref(false)

const { data: professionals } = useProfessionals()
const { data: appointments, isLoading, isError, refetch } = useAppointments(filters)
const cancelMutation = useCancelAppointment()

const professionalOptions = computed(() =>
  (professionals.value ?? []).map(p => ({ value: p.id, label: p.name }))
)

const statusOptions = [
  { value: 'PENDING', label: 'Aguardando' },
  { value: 'CONFIRMED', label: 'Confirmado' },
  { value: 'ARRIVED', label: 'Chegou' },
  { value: 'CALLING', label: 'Chamando' },
  { value: 'IN_PROGRESS', label: 'Em atendimento' },
  { value: 'COMPLETED', label: 'Finalizado' },
  { value: 'CANCELLED', label: 'Cancelado' },
  { value: 'NO_SHOW', label: 'Não compareceu' },
]

const columns = [
  { key: 'patient', label: 'Paciente' },
  { key: 'professional', label: 'Profissional' },
  { key: 'service', label: 'Serviço' },
  { key: 'dateTime', label: 'Data/Hora' },
  { key: 'priority', label: 'Prioridade' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Ações', class: 'text-right' },
]

function clearFilters() {
  filters.value = {}
}

function handleCancel(id: string) {
  cancellingId.value = id
  cancelReason.value = ''
  showCancelDialog.value = true
}

function confirmCancel() {
  if (!cancelReason.value.trim()) return
  cancelMutation.mutate(
    { id: cancellingId.value, data: { reason: cancelReason.value } },
    { onSuccess: () => { showCancelDialog.value = false } }
  )
}

function goToDetail(id: string) {
  router.push(`/appointments/${id}`)
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="page">
    <AppErrorBoundary v-if="isError" @retry="refetch" />
    <template v-else>
    <div class="page__header">
      <h1 class="page__title">Agendamentos</h1>
      <div class="page__header-actions">
        <AppButton variant="ghost" size="sm" @click="showFilters = !showFilters">
          <PhFunnel :size="16" />
          Filtros
        </AppButton>
        <AppButton v-if="canBook" @click="showBookModal = true">
          <PhPlus :size="16" />
          Novo Agendamento
        </AppButton>
      </div>
    </div>

    <div v-if="showFilters" class="page__filters">
      <div class="filters-row">
        <div class="filter-field">
          <label class="filter-label">Data início</label>
          <input type="date" v-model="filters.startDate" class="filter-input" />
        </div>
        <div class="filter-field">
          <label class="filter-label">Data fim</label>
          <input type="date" v-model="filters.endDate" class="filter-input" />
        </div>
        <div class="filter-field">
          <label class="filter-label">Profissional</label>
          <select v-model="filters.professionalId" class="filter-input">
            <option value="">Todos</option>
            <option v-for="opt in professionalOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="filter-field">
          <label class="filter-label">Status</label>
          <select v-model="filters.status" class="filter-input">
            <option value="">Todos</option>
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <button class="filter-clear" @click="clearFilters">Limpar</button>
      </div>
    </div>

    <AppTable :columns="columns" :loading="isLoading" empty="Nenhum agendamento encontrado.">
      <tr v-for="appt in appointments" :key="appt.id" class="table-row" @click="goToDetail(appt.id)">
        <td>
          <div class="cell-primary">{{ appt.patient.name }}</div>
          <div class="cell-secondary">{{ formatCpf(appt.patient.cpf) }}</div>
        </td>
        <td>{{ appt.professional.name }}</td>
        <td>{{ appt.service.name }}</td>
        <td class="cell-mono">{{ formatDate(appt.dateTime) }}</td>
        <td><PriorityBadge :level="appt.verifiedPriority || appt.declaredPriority" size="sm" /></td>
        <td><StatusBadge :status="appt.status" /></td>
        <td class="cell-actions" @click.stop>
          <AppointmentActions
            :appointment="appt"
            @cancel="handleCancel"
          />
        </td>
      </tr>
    </AppTable>

    <div v-if="appointments && appointments.length > 0" class="page__total">
      Total: {{ appointments.length }} agendamento{{ appointments.length !== 1 ? 's' : '' }}
    </div>

    <BookAppointmentForm v-model="showBookModal" />

    <ConfirmDialog
      v-model="showCancelDialog"
      title="Cancelar agendamento"
      message="Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
      confirm-label="Cancelar agendamento"
      variant="danger"
      @confirm="confirmCancel"
    >
      <div class="cancel-reason">
        <label class="filter-label">Motivo do cancelamento *</label>
        <textarea v-model="cancelReason" class="filter-input" rows="3" placeholder="Informe o motivo..." />
      </div>
    </ConfirmDialog>
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

.page__header-actions {
  display: flex;
  gap: var(--space-2);
}

.page__filters {
  background: var(--color-bg-surface);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.filters-row {
  display: flex;
  gap: var(--space-4);
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.filter-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-neutral-600);
}

.filter-input {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  background: white;
  color: var(--color-neutral-900);
}

.filter-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15);
}

.filter-clear {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  background: none;
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.filter-clear:hover {
  background: var(--color-neutral-50);
}

.table-row {
  cursor: pointer;
}

.cell-primary {
  font-weight: var(--font-medium);
  color: var(--color-neutral-900);
}

.cell-secondary {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
}

.cell-mono {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.cell-actions {
  text-align: right;
}

.page__total {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  text-align: right;
}

.cancel-reason {
  margin-top: var(--space-3);
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppointment } from '@/composables/queries/useAppointments'
import { useCancelAppointment } from '@/composables/mutations/useAppointmentMutations'
import { usePermissions } from '@/composables/usePermissions'
import AppCard from '@/components/ui/AppCard.vue'
import AppErrorBoundary from '@/components/ui/AppErrorBoundary.vue'
import AppButton from '@/components/ui/AppButton.vue'
import PriorityBadge from '@/components/shared/PriorityBadge.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import AppointmentActions from '@/components/appointments/AppointmentActions.vue'
import { formatDateTime, formatCpf, formatPhone, formatCurrency, formatPaymentMethod, formatDateTimeRelative } from '@/lib/formatters'
import { PhArrowLeft, PhUser, PhStethoscope } from '@phosphor-icons/vue'
import type { AppointmentStatus } from '@/api/types'

const route = useRoute()
const router = useRouter()
const { canConfirm, canCallNext, canStartAppointment, canComplete } = usePermissions()

const id = computed(() => route.params.id as string)
const { data: appointment, isLoading, isError, refetch } = useAppointment(id)

const showCancelDialog = ref(false)
const cancelReason = ref('')
const cancelMutation = useCancelAppointment()

const statusTimeline: AppointmentStatus[] = [
  'PENDING', 'CONFIRMED', 'ARRIVED', 'CALLING', 'IN_PROGRESS', 'COMPLETED',
]

function goBack() {
  router.push('/appointments')
}

function handleCancel() {
  cancelReason.value = ''
  showCancelDialog.value = true
}

function confirmCancel() {
  if (!cancelReason.value.trim()) return
  cancelMutation.mutate(
    { id: id.value, data: { reason: cancelReason.value } },
    { onSuccess: () => { showCancelDialog.value = false } }
  )
}

function isStatusReached(current: AppointmentStatus, target: AppointmentStatus): boolean {
  const currentIdx = statusTimeline.indexOf(current)
  const targetIdx = statusTimeline.indexOf(target)
  return currentIdx >= targetIdx
}

function isStatusCurrent(current: AppointmentStatus, target: AppointmentStatus): boolean {
  return current === target
}
</script>

<template>
  <div class="page">
    <button class="page__back" @click="goBack">
      <PhArrowLeft :size="16" />
      Agendamentos
    </button>

    <div v-if="isLoading" class="page__loading">
      <div v-for="i in 4" :key="i" class="skeleton-block" />
    </div>

    <template v-else-if="appointment">
      <div class="detail-grid">
        <AppCard>
          <div class="card-header">
            <PhUser :size="20" />
            <h2 class="card-title">Paciente</h2>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">Nome</span>
              <span class="info-value">{{ appointment.patient.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">CPF</span>
              <span class="info-value mono">{{ formatCpf(appointment.patient.cpf) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Telefone</span>
              <span class="info-value mono">{{ formatPhone(appointment.patient.phone) }}</span>
            </div>
            <div v-if="appointment.patient.email" class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">{{ appointment.patient.email }}</span>
            </div>
          </div>
        </AppCard>

        <AppCard>
          <div class="card-header">
            <PhStethoscope :size="20" />
            <h2 class="card-title">Detalhes</h2>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">Profissional</span>
              <span class="info-value">{{ appointment.professional.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Serviço</span>
              <span class="info-value">{{ appointment.service.name }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Data/Hora</span>
              <span class="info-value mono">{{ formatDateTime(appointment.dateTime) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Pagamento</span>
              <span class="info-value">{{ formatPaymentMethod(appointment.paymentMethod) }} — {{ formatCurrency(appointment.service.price) }}</span>
            </div>
          </div>
        </AppCard>
      </div>

      <AppCard>
        <h2 class="card-title">Timeline</h2>
        <div class="timeline">
          <div
            v-for="(status, i) in statusTimeline"
            :key="status"
            :class="[
              'timeline__step',
              {
                'timeline__step--reached': isStatusReached(appointment.status, status),
                'timeline__step--current': isStatusCurrent(appointment.status, status),
              },
            ]"
          >
            <div class="timeline__dot" />
            <span class="timeline__label">{{ status }}</span>
            <div v-if="i < statusTimeline.length - 1" class="timeline__line" />
          </div>
        </div>
      </AppCard>

      <AppCard>
        <h2 class="card-title">Prioridade</h2>
        <div class="priority-info">
          <div class="priority-row">
            <span class="info-label">Declarada</span>
            <PriorityBadge :level="appointment.declaredPriority" size="md" />
          </div>
          <div class="priority-row">
            <span class="info-label">Verificada</span>
            <PriorityBadge :level="appointment.verifiedPriority" size="md" />
          </div>
          <div v-if="appointment.priorityScore" class="priority-row">
            <span class="info-label">Score</span>
            <span class="info-value mono">{{ appointment.priorityScore.toLocaleString() }}</span>
          </div>
          <div v-if="appointment.checkInAt" class="priority-row">
            <span class="info-label">Check-in</span>
            <span class="info-value">{{ formatDateTimeRelative(appointment.checkInAt) }}</span>
          </div>
          <div v-if="appointment.checkInNotes" class="priority-row">
            <span class="info-label">Notas</span>
            <span class="info-value">{{ appointment.checkInNotes }}</span>
          </div>
          <div v-if="appointment.cancellationReason" class="priority-row">
            <span class="info-label">Motivo cancelamento</span>
            <span class="info-value text-danger">{{ appointment.cancellationReason }}</span>
          </div>
        </div>
      </AppCard>

      <AppCard>
        <h2 class="card-title">Ações</h2>
        <AppointmentActions :appointment="appointment" @cancel="handleCancel" />
      </AppCard>
    </template>

    <ConfirmDialog
      v-model="showCancelDialog"
      title="Cancelar agendamento"
      message="Tem certeza que deseja cancelar este agendamento?"
      confirm-label="Cancelar agendamento"
      variant="danger"
      :loading="cancelMutation.isPending.value"
      @confirm="confirmCancel"
    >
      <div class="cancel-reason">
        <label class="filter-label">Motivo do cancelamento *</label>
        <textarea v-model="cancelReason" class="cancel-textarea" rows="3" placeholder="Informe o motivo..." />
      </div>
    </ConfirmDialog>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.page__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-primary-500);
  background: none;
  border: none;
  cursor: pointer;
  font-weight: var(--font-medium);
  width: fit-content;
}

.page__back:hover {
  color: var(--color-primary-400);
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-neutral-100);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
}

.info-value {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-neutral-900);
}

.mono {
  font-family: var(--font-mono);
}

.timeline {
  display: flex;
  align-items: center;
  gap: 0;
  padding: var(--space-4) 0;
  overflow-x: auto;
}

.timeline__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-width: 80px;
}

.timeline__dot {
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
  background: var(--color-neutral-300);
  border: 2px solid var(--color-neutral-200);
  z-index: 1;
  transition: all var(--duration-normal);
}

.timeline__step--reached .timeline__dot {
  background: var(--color-success-500);
  border-color: var(--color-success-700);
}

.timeline__step--current .timeline__dot {
  background: var(--color-primary-500);
  border-color: var(--color-primary-700);
  width: 16px;
  height: 16px;
}

.timeline__label {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  margin-top: var(--space-2);
  white-space: nowrap;
}

.timeline__step--reached .timeline__label {
  color: var(--color-success-700);
  font-weight: var(--font-medium);
}

.timeline__step--current .timeline__label {
  color: var(--color-primary-700);
  font-weight: var(--font-semibold);
}

.timeline__line {
  position: absolute;
  top: 5px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: var(--color-neutral-200);
  z-index: 0;
}

.timeline__step--reached .timeline__line {
  background: var(--color-success-500);
}

.priority-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.priority-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.text-danger {
  color: var(--color-danger-600);
}

.cancel-reason {
  margin-top: var(--space-3);
}

.filter-label {
  display: block;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-neutral-600);
  margin-bottom: var(--space-1);
}

.cancel-textarea {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  resize: vertical;
}

.cancel-textarea:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15);
}

.skeleton-block {
  height: 120px;
  background: linear-gradient(90deg, var(--color-neutral-100) 25%, var(--color-neutral-50) 50%, var(--color-neutral-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-lg);
}
</style>

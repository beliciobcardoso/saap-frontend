<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTodayQueue } from '@/composables/queries/useAppointments'
import { useCallNext, useStartAppointment, useCompleteAppointment } from '@/composables/mutations/useAppointmentMutations'
import { useProfessionals } from '@/composables/queries/useProfessionals'
import PriorityBadge from '@/components/shared/PriorityBadge.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppErrorBoundary from '@/components/ui/AppErrorBoundary.vue'
import QueueStats from '@/components/queue/QueueStats.vue'
import { formatDateTimeRelative } from '@/lib/formatters'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { PhUsersThree, PhCircle } from '@phosphor-icons/vue'

const selectedProfessional = ref<string>('')

const { data: professionals } = useProfessionals()
const { data: queue, isLoading, isError, refetch } = useTodayQueue(selectedProfessional)
const callNextMutation = useCallNext()
const startMutation = useStartAppointment()
const completeMutation = useCompleteAppointment()

const professionalOptions = computed(() =>
  (professionals.value ?? []).filter(p => p.role === 'PROFESSIONAL').map(p => ({ value: p.id, label: p.name }))
)

const sortedQueue = computed(() => {
  const list = queue.value ?? []
  return [...list].sort((a, b) => (a.priorityScore ?? Infinity) - (b.priorityScore ?? Infinity))
})

const nextPatient = computed(() =>
  sortedQueue.value.find(a => a.status === 'ARRIVED' || a.status === 'CONFIRMED')
)

const inProgress = computed(() =>
  sortedQueue.value.filter(a => a.status === 'IN_PROGRESS' || a.status === 'CALLING')
)

const waiting = computed(() =>
  sortedQueue.value.filter(a => a.status === 'ARRIVED' || a.status === 'CONFIRMED')
    .filter(a => a.id !== nextPatient.value?.id)
)

const todayStr = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
</script>

<template>
  <div class="queue-page">
    <div class="queue-topbar">
      <div class="queue-topbar__left">
        <h1 class="queue-topbar__title">Fila de Atendimento</h1>
        <span class="queue-topbar__date">{{ todayStr }}</span>
        <span class="queue-topbar__live">
          <span class="live-dot" />
          ao vivo
        </span>
      </div>
      <select v-model="selectedProfessional" class="queue-select">
        <option value="">Todos os profissionais</option>
        <option v-for="opt in professionalOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <AppErrorBoundary v-if="isError" @retry="refetch" />

    <div v-if="isLoading" class="queue-loading">
      <div v-for="i in 3" :key="i" class="queue-skeleton" />
    </div>

    <div v-else class="queue-content">
      <QueueStats :appointments="sortedQueue" />

      <div v-if="nextPatient" class="queue-section">
        <h2 class="queue-section__title">Próximo na fila</h2>
        <div class="queue-card queue-card--next">
          <div class="queue-card__header">
            <PriorityBadge :level="nextPatient.verifiedPriority || nextPatient.declaredPriority" size="lg" pulse />
            <div class="queue-card__patient">
              <span class="queue-card__name">{{ nextPatient.patient.name }}</span>
              <StatusBadge :status="nextPatient.status" />
            </div>
          </div>
          <div class="queue-card__body">
            <span class="queue-card__service">{{ nextPatient.service.name }}</span>
            <span v-if="nextPatient.checkInAt" class="queue-card__time">
              Chegou {{ formatDateTimeRelative(nextPatient.checkInAt) }}
            </span>
          </div>
          <div class="queue-card__actions">
            <AppButton
              variant="warning"
              size="lg"
              full-width
              @click="callNextMutation.mutate(nextPatient.id)"
              :loading="callNextMutation.isPending.value"
            >
              Chamar paciente
            </AppButton>
          </div>
        </div>
      </div>

      <div v-if="inProgress.length > 0" class="queue-section">
        <h2 class="queue-section__title">Em atendimento ({{ inProgress.length }})</h2>
        <div v-for="appt in inProgress" :key="appt.id" class="queue-card queue-card--progress">
          <div class="queue-card__header">
            <PriorityBadge :level="appt.verifiedPriority || appt.declaredPriority" size="md" />
            <div class="queue-card__patient">
              <span class="queue-card__name">{{ appt.patient.name }}</span>
              <StatusBadge :status="appt.status" />
            </div>
          </div>
          <div class="queue-card__body">
            <span class="queue-card__service">{{ appt.service.name }}</span>
          </div>
          <div class="queue-card__actions">
            <AppButton
              v-if="appt.status === 'CALLING'"
              variant="primary"
              size="sm"
              @click="startMutation.mutate(appt.id)"
              :loading="startMutation.isPending.value"
            >
              Iniciar atendimento
            </AppButton>
            <AppButton
              v-if="appt.status === 'IN_PROGRESS'"
              variant="success"
              size="sm"
              @click="completeMutation.mutate(appt.id)"
              :loading="completeMutation.isPending.value"
            >
              Finalizar
            </AppButton>
          </div>
        </div>
      </div>

      <div v-if="waiting.length > 0" class="queue-section">
        <h2 class="queue-section__title">Aguardando ({{ waiting.length }})</h2>
        <div v-for="appt in waiting" :key="appt.id" class="queue-card queue-card--waiting">
          <div class="queue-card__header">
            <PriorityBadge :level="appt.verifiedPriority || appt.declaredPriority" size="sm" />
            <span class="queue-card__name">{{ appt.patient.name }}</span>
          </div>
          <div class="queue-card__body">
            <span class="queue-card__service">{{ appt.service.name }}</span>
            <span v-if="appt.checkInAt" class="queue-card__time">
              Chegou {{ formatDateTimeRelative(appt.checkInAt) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="!nextPatient && inProgress.length === 0 && waiting.length === 0" class="queue-empty">
        <PhUsersThree :size="48" />
        <p>Fila vazia</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.queue-page {
  min-height: 100vh;
  background: var(--color-primary-950);
  color: white;
  padding: var(--space-6);
}

.queue-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
  gap: var(--space-4);
}

.queue-topbar__left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.queue-topbar__title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
}

.queue-topbar__date {
  font-size: var(--text-sm);
  opacity: 0.7;
}

.queue-topbar__live {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-success-500);
  font-weight: var(--font-medium);
}

.live-dot {
  width: 8px;
  height: 8px;
  background: var(--color-success-500);
  border-radius: var(--radius-full);
  animation: live-pulse 1.5s ease-in-out infinite;
}

.queue-select {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  border-radius: var(--radius-sm);
  background: var(--color-primary-800);
  color: white;
  border: 1px solid var(--color-primary-600);
}

.queue-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.queue-section__title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--color-primary-300);
  margin-bottom: var(--space-3);
}

.queue-card {
  background: var(--color-primary-800);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  border: 1px solid var(--color-primary-700);
  transition: border-color var(--duration-fast);
}

.queue-card--next {
  border-color: var(--color-accent-500);
  border-width: 2px;
  animation: p1-pulse 2s ease-in-out infinite;
}

.queue-card--progress {
  border-color: var(--color-primary-500);
}

.queue-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.queue-card__patient {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.queue-card__name {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.queue-card__body {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.queue-card__service {
  font-size: var(--text-sm);
  opacity: 0.8;
}

.queue-card__time {
  font-size: var(--text-sm);
  opacity: 0.6;
}

.queue-card__actions {
  display: flex;
  gap: var(--space-3);
}

.queue-card--waiting {
  padding: var(--space-3) var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.queue-card--waiting .queue-card__header {
  margin-bottom: 0;
}

.queue-card--waiting .queue-card__body {
  margin-bottom: 0;
}

.queue-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-16);
  color: var(--color-primary-400);
  font-size: var(--text-lg);
}

.queue-loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.queue-skeleton {
  height: 120px;
  background: var(--color-primary-800);
  border-radius: var(--radius-lg);
  animation: shimmer 1.5s infinite;
}
</style>

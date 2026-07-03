<script setup lang="ts">
import type { AppointmentResponse } from '@/api/types'
import PriorityBadge from '@/components/shared/PriorityBadge.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import { formatTime } from '@/lib/formatters'
import { useRouter } from 'vue-router'

interface Props {
  appointments: AppointmentResponse[]
  loading?: boolean
}

defineProps<Props>()

const router = useRouter()

function goToDetail(id: string) {
  router.push(`/appointments/${id}`)
}
</script>

<template>
  <div class="today-schedule">
    <div v-if="loading" class="today-schedule__loading">
      <div v-for="i in 5" :key="i" class="today-schedule__skeleton" />
    </div>

    <div v-else-if="appointments.length === 0">
      <AppEmptyState
        title="Nenhum agendamento hoje"
        description="Não há consultas agendadas para hoje."
      />
    </div>

    <div v-else class="today-schedule__list">
      <button
        v-for="appt in appointments"
        :key="appt.id"
        class="today-schedule__item"
        @click="goToDetail(appt.id)"
      >
        <div class="today-schedule__time">
          {{ formatTime(appt.dateTime) }}
        </div>
        <div class="today-schedule__info">
          <span class="today-schedule__patient">{{ appt.patient.name }}</span>
          <span class="today-schedule__service">{{ appt.service.name }} — {{ appt.professional.name }}</span>
        </div>
        <div class="today-schedule__badges">
          <PriorityBadge :level="appt.verifiedPriority || appt.declaredPriority" size="sm" />
          <StatusBadge :status="appt.status" />
        </div>
        <div class="today-schedule__arrow">→</div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.today-schedule__list {
  display: flex;
  flex-direction: column;
}

.today-schedule__item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid var(--color-neutral-100);
  transition: background var(--duration-fast);
}

.today-schedule__item:last-child {
  border-bottom: none;
}

.today-schedule__item:hover {
  background: var(--color-neutral-50);
}

.today-schedule__time {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-primary-600);
  min-width: 50px;
}

.today-schedule__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.today-schedule__patient {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-neutral-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.today-schedule__service {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
}

.today-schedule__badges {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.today-schedule__arrow {
  color: var(--color-neutral-300);
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.today-schedule__loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
}

.today-schedule__skeleton {
  height: 48px;
  background: linear-gradient(90deg, var(--color-neutral-100) 25%, var(--color-neutral-50) 50%, var(--color-neutral-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}
</style>

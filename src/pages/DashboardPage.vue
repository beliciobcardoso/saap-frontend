<script setup lang="ts">
import { computed } from 'vue'
import { useAppointments } from '@/composables/queries/useAppointments'
import { useAuthStore } from '@/stores/auth'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import StatCard from '@/components/dashboard/StatCard.vue'
import TodaySchedule from '@/components/dashboard/TodaySchedule.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppErrorBoundary from '@/components/ui/AppErrorBoundary.vue'
import { useRouter } from 'vue-router'
import {
  PhCalendarCheck,
  PhClock,
  PhStethoscope,
  PhCheckCircle,
  PhQueue,
  PhArrowRight,
} from '@phosphor-icons/vue'

const authStore = useAuthStore()
const router = useRouter()

const today = new Date()
const todayStr = today.toISOString().split('T')[0]
const greeting = computed(() => {
  const hour = today.getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
})

const dateStr = format(today, "EEEE, dd 'de' MMMM", { locale: ptBR })

const { data: appointments, isLoading, isError, refetch } = useAppointments()

const stats = computed(() => {
  const list = (appointments.value ?? []).filter(a => a.dateTime.startsWith(todayStr))
  return {
    total: list.length,
    confirmed: list.filter(a => a.status === 'CONFIRMED').length,
    arrived: list.filter(a => a.status === 'ARRIVED').length,
    inProgress: list.filter(a => a.status === 'IN_PROGRESS').length,
    completed: list.filter(a => a.status === 'COMPLETED').length,
  }
})

const todayAppointments = computed(() => {
  return (appointments.value ?? [])
    .filter(a => a.dateTime.startsWith(todayStr))
    .sort((a, b) => a.priorityScore ?? Infinity - (b.priorityScore ?? Infinity))
})

function goToAppointments() {
  router.push('/appointments')
}

function goToQueue() {
  router.push('/queue')
}
</script>

<template>
  <div class="dashboard">
    <AppErrorBoundary v-if="isError" @retry="refetch" />

    <template v-else>
    <div class="dashboard__header">
      <div>
        <h1 class="dashboard__greeting">{{ greeting }}, {{ authStore.userEmail?.split('@')[0] }}!</h1>
        <p class="dashboard__date">{{ dateStr }}</p>
      </div>
      <div class="dashboard__quick-actions">
        <button class="quick-action" @click="goToAppointments">
          <PhCalendarCheck :size="16" />
          <span>Agendamentos</span>
        </button>
        <button class="quick-action" @click="goToQueue">
          <PhQueue :size="16" />
          <span>Fila</span>
        </button>
      </div>
    </div>

    <div class="dashboard__stats">
      <StatCard label="Agendados" :value="stats.total" color="primary">
        <template #icon><PhCalendarCheck :size="28" /></template>
      </StatCard>
      <StatCard label="Confirmados" :value="stats.confirmed" color="info">
        <template #icon><PhClock :size="28" /></template>
      </StatCard>
      <StatCard label="Em atendimento" :value="stats.inProgress" color="warning">
        <template #icon><PhStethoscope :size="28" /></template>
      </StatCard>
      <StatCard label="Finalizados" :value="stats.completed" color="success">
        <template #icon><PhCheckCircle :size="28" /></template>
      </StatCard>
    </div>

    <AppCard>
      <div class="dashboard__section-header">
        <h2 class="dashboard__section-title">Agendamentos de hoje</h2>
        <button class="dashboard__view-all" @click="goToAppointments">
          Ver todos
          <PhArrowRight :size="14" />
        </button>
      </div>
      <TodaySchedule :appointments="todayAppointments" :loading="isLoading" />
    </AppCard>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.dashboard__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.dashboard__greeting {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.dashboard__date {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  margin-top: var(--space-1);
  text-transform: capitalize;
}

.dashboard__quick-actions {
  display: flex;
  gap: var(--space-2);
}

.quick-action {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-primary-600);
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-200);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.quick-action:hover {
  background: var(--color-primary-100);
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

@media (max-width: 1024px) {
  .dashboard__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .dashboard__stats {
    grid-template-columns: 1fr;
  }
}

.dashboard__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.dashboard__section-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.dashboard__view-all {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--color-primary-500);
  background: none;
  border: none;
  cursor: pointer;
  font-weight: var(--font-medium);
}

.dashboard__view-all:hover {
  color: var(--color-primary-400);
}
</style>

<script setup lang="ts">
import type { AppointmentResponse } from '@/api/types'

interface Props {
  appointments: AppointmentResponse[]
}

const props = defineProps<Props>()

const stats = {
  get waiting() {
    return props.appointments.filter(a => ['ARRIVED', 'CONFIRMED'].includes(a.status)).length
  },
  get calling() {
    return props.appointments.filter(a => a.status === 'CALLING').length
  },
  get inProgress() {
    return props.appointments.filter(a => a.status === 'IN_PROGRESS').length
  },
  get completed() {
    return props.appointments.filter(a => a.status === 'COMPLETED').length
  },
}
</script>

<template>
  <div class="queue-stats">
    <div class="queue-stat queue-stat--waiting">
      <span class="queue-stat__value">{{ stats.waiting }}</span>
      <span class="queue-stat__label">Aguardando</span>
    </div>
    <div class="queue-stat queue-stat--calling">
      <span class="queue-stat__value">{{ stats.calling }}</span>
      <span class="queue-stat__label">Chamando</span>
    </div>
    <div class="queue-stat queue-stat--progress">
      <span class="queue-stat__value">{{ stats.inProgress }}</span>
      <span class="queue-stat__label">Em atendimento</span>
    </div>
    <div class="queue-stat queue-stat--completed">
      <span class="queue-stat__value">{{ stats.completed }}</span>
      <span class="queue-stat__label">Finalizados</span>
    </div>
  </div>
</template>

<style scoped>
.queue-stats {
  display: flex;
  gap: var(--space-4);
}

.queue-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  background: var(--color-primary-800);
  min-width: 100px;
}

.queue-stat__value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
}

.queue-stat__label {
  font-size: var(--text-xs);
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.queue-stat--waiting .queue-stat__value { color: var(--color-accent-400); }
.queue-stat--calling .queue-stat__value { color: var(--color-accent-500); }
.queue-stat--progress .queue-stat__value { color: var(--color-primary-300); }
.queue-stat--completed .queue-stat__value { color: var(--color-success-500); }

@media (max-width: 640px) {
  .queue-stats {
    flex-wrap: wrap;
  }
  .queue-stat {
    min-width: calc(50% - var(--space-2));
    flex: 1;
  }
}
</style>

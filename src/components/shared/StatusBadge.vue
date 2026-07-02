<script setup lang="ts">
import type { AppointmentStatus } from '@/api/types'

defineProps<{ status: AppointmentStatus }>()

const config: Record<AppointmentStatus, { label: string; class: string }> = {
  PENDING:          { label: 'Aguardando',     class: 'status--pending' },
  PENDING_RESPONSE: { label: 'Respondendo',    class: 'status--pending-response' },
  CONFIRMED:        { label: 'Confirmado',     class: 'status--confirmed' },
  ARRIVED:          { label: 'Chegou',         class: 'status--arrived' },
  CALLING:          { label: 'Chamando',       class: 'status--calling' },
  IN_PROGRESS:      { label: 'Em atendimento', class: 'status--in-progress' },
  COMPLETED:        { label: 'Finalizado',     class: 'status--completed' },
  CANCELLED:        { label: 'Cancelado',      class: 'status--cancelled' },
  NO_SHOW:          { label: 'Não compareceu', class: 'status--no-show' },
}
</script>

<template>
  <span :class="['status-badge', config[status].class]">
    {{ config[status].label }}
  </span>
</template>

<style scoped>
.status-badge {
  @apply inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full;
}
.status--pending          { color: #92400E; background: #FEF3C7; }
.status--pending-response { color: #5B21B6; background: #EDE9FE; }
.status--confirmed        { color: #1E40AF; background: #DBEAFE; }
.status--arrived          { color: #065F46; background: #D1FAE5; }
.status--calling          { color: #9A3412; background: #FED7AA; animation: blink 1s step-end infinite; }
.status--in-progress      { color: #065F46; background: #A7F3D0; }
.status--completed        { color: #374151; background: #F3F4F6; }
.status--cancelled        { color: #991B1B; background: #FEE2E2; }
.status--no-show          { color: #6B7280; background: #F9FAFB; border: 1px solid #E5E7EB; }

@keyframes blink { 50% { opacity: 0.6; } }
</style>

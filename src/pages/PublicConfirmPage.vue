<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { appointmentsApi } from '@/api/appointments'
import { getApiErrorMessage } from '@/api/client'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import { PhCheckCircle, PhXCircle } from '@phosphor-icons/vue'
import type { AppointmentResponse } from '@/api/types'

const route = useRoute()

const status = ref<'loading' | 'success' | 'error' | 'invalid'>('loading')
const message = ref('')
const appointment = ref<AppointmentResponse | null>(null)

onMounted(async () => {
  const token = route.query.token as string
  const action = route.query.action as string

  if (!token || !action) {
    status.value = 'invalid'
    message.value = 'Link inválido. Verifique o email recebido.'
    return
  }

  try {
    const data = action === 'confirm'
      ? await appointmentsApi.publicConfirm(token)
      : await appointmentsApi.publicCancel(token)

    status.value = 'success'
    appointment.value = data
    message.value = action === 'confirm'
      ? 'Agendamento confirmado com sucesso!'
      : 'Agendamento cancelado com sucesso.'
  } catch (error) {
    status.value = 'error'
    message.value = getApiErrorMessage(error)
  }
})

function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="confirm-page">
    <div class="confirm-card">
      <div class="confirm-logo">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="var(--color-primary-500)" fill-opacity="0.1" />
          <path d="M14 24h20M24 14v20" stroke="var(--color-primary-500)" stroke-width="3" stroke-linecap="round" />
        </svg>
        <span class="confirm-logo__text">SAAP</span>
      </div>

      <div v-if="status === 'loading'" class="confirm-loading">
        <AppSpinner :size="32" />
        <p>Processando...</p>
      </div>

      <template v-else-if="status === 'success'">
        <PhCheckCircle :size="64" class="confirm-icon confirm-icon--success" />
        <h1 class="confirm-title">{{ appointment?.status === 'CONFIRMED' ? 'Agendamento Confirmado!' : 'Agendamento Cancelado' }}</h1>
        <p class="confirm-message">{{ message }}</p>
        <div v-if="appointment" class="confirm-details">
          <div class="confirm-detail">
            <span class="confirm-detail__label">Data</span>
            <span class="confirm-detail__value">{{ formatDate(appointment.dateTime) }}</span>
          </div>
          <div class="confirm-detail">
            <span class="confirm-detail__label">Profissional</span>
            <span class="confirm-detail__value">{{ appointment.professional.name }}</span>
          </div>
          <div class="confirm-detail">
            <span class="confirm-detail__label">Serviço</span>
            <span class="confirm-detail__value">{{ appointment.service.name }}</span>
          </div>
        </div>
      </template>

      <template v-else-if="status === 'error'">
        <PhXCircle :size="64" class="confirm-icon confirm-icon--error" />
        <h1 class="confirm-title">Erro ao processar</h1>
        <p class="confirm-message">{{ message }}</p>
      </template>

      <template v-else>
        <PhXCircle :size="64" class="confirm-icon confirm-icon--error" />
        <h1 class="confirm-title">Link inválido</h1>
        <p class="confirm-message">{{ message }}</p>
      </template>

      <div class="confirm-footer">
        <p>Este link é temporário. Caso tenha dúvidas, entre em contato com a clínica.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirm-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-base);
  padding: var(--space-6);
}

.confirm-card {
  max-width: 480px;
  width: 100%;
  background: var(--color-bg-surface);
  border-radius: var(--radius-xl);
  padding: var(--space-10);
  box-shadow: var(--shadow-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.confirm-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.confirm-logo__text {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-primary-500);
}

.confirm-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-8) 0;
}

.confirm-loading p {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
}

.confirm-icon--success { color: var(--color-success-500); }
.confirm-icon--error { color: var(--color-danger-500); }

.confirm-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.confirm-message {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  line-height: var(--leading-relaxed);
}

.confirm-details {
  width: 100%;
  margin-top: var(--space-4);
  padding: var(--space-4);
  background: var(--color-bg-sunken);
  border-radius: var(--radius-md);
}

.confirm-detail {
  display: flex;
  justify-content: space-between;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-neutral-200);
}

.confirm-detail:last-child {
  border-bottom: none;
}

.confirm-detail__label {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
}

.confirm-detail__value {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-neutral-900);
}

.confirm-footer {
  margin-top: var(--space-4);
}

.confirm-footer p {
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
}
</style>

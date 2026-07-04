<script setup lang="ts">
import { ref } from 'vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useCancelAppointment } from '@/composables/mutations/useAppointmentMutations'

interface Props {
  modelValue: boolean
  appointmentId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const reason = ref('')
const cancelMutation = useCancelAppointment()

function close() {
  reason.value = ''
  emit('update:modelValue', false)
}

function confirm() {
  if (!reason.value.trim()) return
  cancelMutation.mutate(
    { id: props.appointmentId, data: { reason: reason.value } },
    { onSuccess: () => close() }
  )
}
</script>

<template>
  <AppModal :model-value="modelValue" @update:model-value="close" title="Cancelar Agendamento" size="sm">
    <p class="cancel-message">
      Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
    </p>
    <div class="cancel-reason">
      <label class="cancel-label">Motivo do cancelamento *</label>
      <textarea
        v-model="reason"
        class="cancel-textarea"
        rows="3"
        placeholder="Informe o motivo..."
      />
    </div>
    <template #footer>
      <AppButton variant="ghost" @click="close">Cancelar</AppButton>
      <AppButton
        variant="danger"
        :loading="cancelMutation.isPending.value"
        :disabled="!reason.trim()"
        @click="confirm"
      >
        Cancelar agendamento
      </AppButton>
    </template>
  </AppModal>
</template>

<style scoped>
.cancel-message {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  line-height: var(--leading-relaxed);
  margin-bottom: var(--space-4);
}

.cancel-reason {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.cancel-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-neutral-700);
}

.cancel-textarea {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  background: white;
  color: var(--color-neutral-900);
  resize: vertical;
  transition: all var(--duration-fast);
}

.cancel-textarea:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15);
}
</style>

<script setup lang="ts">
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  confirmLabel?: string
  variant?: 'danger' | 'warning' | 'primary'
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Confirmar ação',
  message: 'Tem certeza que deseja continuar?',
  confirmLabel: 'Confirmar',
  variant: 'danger',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

function cancel() {
  emit('update:modelValue', false)
}

function confirm() {
  emit('confirm')
}
</script>

<template>
  <AppModal :model-value="modelValue" @update:model-value="cancel" size="sm" :title="title">
    <p class="confirm-message">{{ message }}</p>
    <template #footer>
      <AppButton variant="ghost" @click="cancel">Cancelar</AppButton>
      <AppButton :variant="variant" :loading="loading" @click="confirm">
        {{ confirmLabel }}
      </AppButton>
    </template>
  </AppModal>
</template>

<style scoped>
.confirm-message {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  line-height: var(--leading-relaxed);
}
</style>

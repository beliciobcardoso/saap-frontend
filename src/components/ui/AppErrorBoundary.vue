<script setup lang="ts">
import AppButton from '@/components/ui/AppButton.vue'
import { PhWarning, PhArrowClockwise } from '@phosphor-icons/vue'

interface Props {
  error?: Error | null
}

defineProps<Props>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="error-boundary">
    <PhWarning :size="48" class="error-boundary__icon" />
    <h3 class="error-boundary__title">Algo deu errado</h3>
    <p class="error-boundary__message">
      {{ error?.message || 'Ocorreu um erro inesperado. Tente novamente.' }}
    </p>
    <AppButton variant="secondary" size="sm" @click="emit('retry')">
      <PhArrowClockwise :size="16" />
      Tentar novamente
    </AppButton>
  </div>
</template>

<style scoped>
.error-boundary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-6);
  text-align: center;
}

.error-boundary__icon {
  color: var(--color-danger-400);
}

.error-boundary__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.error-boundary__message {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  max-width: 400px;
}
</style>

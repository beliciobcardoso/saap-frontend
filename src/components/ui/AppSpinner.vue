<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), { size: 'md' })
</script>

<template>
  <div :class="['spinner', `spinner--${size}`]" role="status" aria-label="Carregando..." />
</template>

<style scoped>
.spinner {
  border-radius: 50%;
  border: 2px solid var(--color-neutral-200);
  border-top-color: var(--color-primary-500);
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

.spinner--sm { width: 16px; height: 16px; }
.spinner--md { width: 24px; height: 24px; }
.spinner--lg { width: 40px; height: 40px; border-width: 3px; }

@keyframes spin { to { transform: rotate(360deg); } }
</style>

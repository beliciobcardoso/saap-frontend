<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), { variant: 'default', size: 'md' })
</script>

<template>
  <span :class="['badge', `badge--${variant}`, `badge--${size}`]">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  @apply inline-flex items-center font-medium rounded-full;
}
.badge--sm { @apply text-xs px-2 py-0.5; }
.badge--md { @apply text-xs px-2.5 py-1; }

.badge--default { color: var(--color-neutral-700); background: var(--color-neutral-100); }
.badge--primary { color: var(--color-primary-700); background: var(--color-primary-100); }
.badge--success { color: var(--color-success-700); background: var(--color-success-100); }
.badge--warning { color: var(--color-warning-700); background: var(--color-warning-100); }
.badge--danger  { color: var(--color-danger-700);  background: var(--color-danger-100); }
.badge--info    { color: #1E40AF; background: var(--color-info-100); }
</style>

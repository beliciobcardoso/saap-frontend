<script setup lang="ts">
import { PhCircleNotch } from '@phosphor-icons/vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--loading': loading, 'btn--full': fullWidth },
    ]"
  >
    <PhCircleNotch v-if="loading" class="btn__spinner" :size="16" weight="bold" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center gap-2 font-medium rounded border
         transition-all focus-visible:outline-none focus-visible:ring-2
         focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none;
  font-family: var(--font-body);
}
.btn--xs  { @apply text-xs px-2.5 py-1.5; }
.btn--sm  { @apply text-sm px-3 py-2; }
.btn--md  { @apply text-sm px-4 py-2.5; }
.btn--lg  { @apply text-base px-6 py-3; }
.btn--full { @apply w-full; }

.btn--primary {
  @apply bg-[var(--color-primary-500)] text-white border-transparent
         hover:bg-[var(--color-primary-400)] focus-visible:ring-[var(--color-primary-500)];
}
.btn--secondary {
  @apply bg-white text-[var(--color-neutral-700)] border-[var(--color-neutral-300)]
         hover:bg-[var(--color-neutral-50)];
}
.btn--ghost {
  @apply bg-transparent text-[var(--color-neutral-600)] border-transparent
         hover:bg-[var(--color-neutral-100)];
}
.btn--danger {
  @apply bg-[var(--color-danger-600)] text-white border-transparent
         hover:bg-[var(--color-danger-700)];
}
.btn--success {
  @apply bg-[var(--color-success-500)] text-white border-transparent
         hover:bg-[var(--color-success-700)];
}
.btn--warning {
  @apply bg-[var(--color-accent-500)] text-white border-transparent
         hover:bg-[var(--color-accent-600)];
}

.btn__spinner { @apply animate-spin; }
</style>

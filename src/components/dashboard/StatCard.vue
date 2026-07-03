<script setup lang="ts">
import AppCard from '@/components/ui/AppCard.vue'
import type { PriorityLevel } from '@/api/types'

interface Props {
  label: string
  value: string | number
  icon?: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  priority?: PriorityLevel
}

withDefaults(defineProps<Props>(), {
  color: 'primary',
})
</script>

<template>
  <AppCard :class="['stat-card', `stat-card--${color}`]">
    <div class="stat-card__inner">
      <div class="stat-card__info">
        <span class="stat-card__label">{{ label }}</span>
        <span class="stat-card__value">{{ value }}</span>
      </div>
      <div v-if="$slots.icon" class="stat-card__icon">
        <slot name="icon" />
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.stat-card {
  border-left: 4px solid transparent;
}

.stat-card--primary { border-left-color: var(--color-primary-500); }
.stat-card--success { border-left-color: var(--color-success-500); }
.stat-card--warning { border-left-color: var(--color-accent-500); }
.stat-card--danger  { border-left-color: var(--color-danger-500); }
.stat-card--info    { border-left-color: var(--color-info-500); }

.stat-card__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-card__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-card__label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-neutral-500);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.stat-card__value {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
  line-height: 1;
}

.stat-card__icon {
  color: var(--color-neutral-300);
}
</style>

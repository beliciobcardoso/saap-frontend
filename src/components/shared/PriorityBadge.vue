<script setup lang="ts">
import type { PriorityLevel } from '@/api/types'

interface Props {
  level: PriorityLevel | null | undefined
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
}

withDefaults(defineProps<Props>(), { size: 'md' })

const labelMap: Record<PriorityLevel, string> = {
  P1: 'P1 — Crítico',
  P2: 'P2 — Urgente',
  P3: 'P3 — Moderado',
  P4: 'P4 — Baixo',
  P5: 'P5 — Padrão',
}

const colorMap: Record<PriorityLevel, string> = {
  P1: 'priority-p1',
  P2: 'priority-p2',
  P3: 'priority-p3',
  P4: 'priority-p4',
  P5: 'priority-p5',
}
</script>

<template>
  <span
    v-if="level"
    :class="[
      'priority-badge',
      `priority-badge--${size}`,
      colorMap[level],
      { 'priority-badge--pulse': pulse && level === 'P1' },
    ]"
  >
    {{ size === 'lg' ? labelMap[level] : level }}
  </span>
  <span v-else class="priority-badge priority-badge--unknown">—</span>
</template>

<style scoped>
.priority-badge {
  @apply inline-flex items-center font-semibold rounded-full tracking-wide;
  font-family: var(--font-mono);
}
.priority-badge--sm { @apply text-xs px-2 py-0.5; }
.priority-badge--md { @apply text-xs px-2.5 py-1; }
.priority-badge--lg { @apply text-sm px-3 py-1.5; }

.priority-p1 { background: var(--color-p1-bg); color: var(--color-p1-text); border: 1px solid var(--color-p1-border); }
.priority-p2 { background: var(--color-p2-bg); color: var(--color-p2-text); border: 1px solid var(--color-p2-border); }
.priority-p3 { background: var(--color-p3-bg); color: var(--color-p3-text); border: 1px solid var(--color-p3-border); }
.priority-p4 { background: var(--color-p4-bg); color: var(--color-p4-text); border: 1px solid var(--color-p4-border); }
.priority-p5 { background: var(--color-p5-bg); color: var(--color-p5-text); border: 1px solid var(--color-p5-border); }
.priority-badge--unknown { @apply text-gray-400 text-xs; }

.priority-badge--pulse {
  animation: pulse-p1 1.5s ease-in-out infinite;
}

@keyframes pulse-p1 {
  0%, 100% { box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); }
  50%       { box-shadow: 0 0 0 6px rgba(225, 29, 72, 0); }
}
</style>

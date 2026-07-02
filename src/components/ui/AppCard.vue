<script setup lang="ts">
interface Props {
  padding?: 'sm' | 'md' | 'lg'
  shadow?: boolean
}

withDefaults(defineProps<Props>(), { padding: 'md', shadow: true })
</script>

<template>
  <div :class="['card', `card--${padding}`, { 'card--shadow': shadow }]">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
}

.card--sm  { padding: var(--space-4); }
.card--md  { padding: var(--space-6); }
.card--lg  { padding: var(--space-8); }
.card--shadow { box-shadow: var(--shadow-sm); }
</style>

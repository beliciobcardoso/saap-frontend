<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Nenhum resultado',
  description: 'Não há dados para exibir.',
})
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <slot name="icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" fill="var(--color-neutral-100)" />
          <path d="M16 24h16M24 16v16" stroke="var(--color-neutral-400)" stroke-width="2" stroke-linecap="round" />
        </svg>
      </slot>
    </div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p class="empty-state__desc">{{ description }}</p>
    <div v-if="$slots.action" class="empty-state__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-12) var(--space-6);
  text-align: center;
}

.empty-state__icon { color: var(--color-neutral-400); }
.empty-state__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-700);
}
.empty-state__desc { font-size: var(--text-sm); color: var(--color-neutral-500); }
.empty-state__action { margin-top: var(--space-2); }
</style>

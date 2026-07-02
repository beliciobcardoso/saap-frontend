<script setup lang="ts">
interface Column {
  key: string
  label: string
  class?: string
}

interface Props {
  columns: Column[]
  loading?: boolean
  empty?: string
}

withDefaults(defineProps<Props>(), { empty: 'Nenhum registro encontrado.' })
</script>

<template>
  <div class="table-wrap">
    <table class="table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :class="col.class">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="table__loading">
            <div class="table__skeleton" v-for="i in 5" :key="i" />
          </td>
        </tr>
        <slot v-else />
        <tr v-if="!loading && !$slots.default">
          <td :colspan="columns.length" class="table__empty">{{ empty }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.table thead tr {
  background-color: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-neutral-200);
}

.table th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-weight: var(--font-semibold);
  color: var(--color-neutral-600);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  white-space: nowrap;
}

.table :deep(td) {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-neutral-100);
  color: var(--color-neutral-800);
  vertical-align: middle;
}

.table :deep(tbody tr:last-child td) {
  border-bottom: none;
}

.table :deep(tbody tr:hover td) {
  background-color: var(--color-neutral-50);
}

.table__empty,
.table__loading {
  text-align: center;
  color: var(--color-neutral-400);
  padding: var(--space-8) !important;
}

.table__skeleton {
  height: 16px;
  background: linear-gradient(90deg, var(--color-neutral-200) 25%, var(--color-neutral-100) 50%, var(--color-neutral-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
  margin: var(--space-2) 0;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>

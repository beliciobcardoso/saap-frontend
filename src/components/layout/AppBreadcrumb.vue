<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PhHouse, PhCaretRight } from '@phosphor-icons/vue'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
  const items: { label: string; path?: string }[] = []
  const title = route.meta.title as string | undefined

  if (route.name === 'Dashboard' || route.path === '/dashboard') {
    return [{ label: 'Dashboard' }]
  }

  if (route.name === 'AppointmentDetail') {
    items.push({ label: 'Agendamentos', path: '/appointments' })
    items.push({ label: 'Detalhes' })
    return items
  }

  if (title) {
    items.push({ label: title })
  }

  return items
})

function goHome() {
  router.push('/dashboard')
}
</script>

<template>
  <nav v-if="breadcrumbs.length > 1" class="breadcrumb">
    <button class="breadcrumb__home" @click="goHome" title="Dashboard">
      <PhHouse :size="14" />
    </button>
    <template v-for="(crumb, i) in breadcrumbs" :key="i">
      <PhCaretRight :size="12" class="breadcrumb__sep" />
      <span
        v-if="crumb.path"
        class="breadcrumb__link"
        @click="router.push(crumb.path!)"
      >
        {{ crumb.label }}
      </span>
      <span v-else class="breadcrumb__current">{{ crumb.label }}</span>
    </template>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
}

.breadcrumb__home {
  background: none;
  border: none;
  color: var(--color-neutral-400);
  cursor: pointer;
  padding: var(--space-1);
  display: flex;
  border-radius: var(--radius-sm);
  transition: color var(--duration-fast);
}

.breadcrumb__home:hover {
  color: var(--color-primary-500);
}

.breadcrumb__sep {
  color: var(--color-neutral-300);
  flex-shrink: 0;
}

.breadcrumb__link {
  color: var(--color-neutral-500);
  cursor: pointer;
  transition: color var(--duration-fast);
}

.breadcrumb__link:hover {
  color: var(--color-primary-500);
}

.breadcrumb__current {
  color: var(--color-neutral-900);
  font-weight: var(--font-medium);
}
</style>

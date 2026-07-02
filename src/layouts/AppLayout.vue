<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { useUiStore } from '@/stores/ui'
import { computed } from 'vue'

const ui = useUiStore()
const sidebarWidth = computed(() =>
  ui.sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'
)
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="app-layout__main" :style="{ marginLeft: sidebarWidth }">
      <AppTopbar />
      <main class="app-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: var(--color-bg-base);
}

.app-layout__main {
  transition: margin-left var(--duration-normal) var(--ease-in-out);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-layout__content {
  flex: 1;
  padding: var(--content-padding);
  padding-top: calc(var(--topbar-height) + var(--content-padding));
  max-width: var(--content-max-width);
  width: 100%;
}
</style>

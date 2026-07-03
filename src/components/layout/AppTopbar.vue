<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { PhSignOut } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useAuth } from '@/composables/useAuth'
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'

const route = useRoute()
const authStore = useAuthStore()
const ui = useUiStore()
const { logout } = useAuth()

const userInitial = computed(() =>
  authStore.userEmail?.charAt(0).toUpperCase() ?? '?'
)

const roleLabel: Record<string, string> = {
  ADMIN: 'Admin',
  RECEPTIONIST: 'Recepcionista',
  PROFESSIONAL: 'Profissional',
  ASSISTANT: 'Assistente',
  PATIENT: 'Paciente',
}

const userRoleLabel = computed(() =>
  authStore.userRole ? roleLabel[authStore.userRole] ?? authStore.userRole : ''
)

const sidebarWidth = computed(() =>
  ui.sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'
)
</script>

<template>
  <header class="topbar" :style="{ left: sidebarWidth }">
    <div class="topbar__left">
      <AppBreadcrumb />
    </div>
    <div class="topbar__right">
      <div class="topbar__user">
        <div class="topbar__avatar">{{ userInitial }}</div>
        <div class="topbar__user-info">
          <span class="topbar__email">{{ authStore.userEmail }}</span>
          <span class="topbar__role">{{ userRoleLabel }}</span>
        </div>
      </div>
      <button class="topbar__logout" @click="logout" title="Sair">
        <PhSignOut :size="18" weight="regular" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  right: 0;
  height: var(--topbar-height);
  background-color: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-neutral-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--content-padding);
  z-index: var(--z-sticky);
  box-shadow: var(--shadow-xs);
  transition: left var(--duration-normal) var(--ease-in-out);
}

.topbar__left {
  display: flex;
  align-items: center;
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.topbar__user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.topbar__avatar {
  width: 36px;
  height: 36px;
  background-color: var(--color-primary-500);
  color: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  flex-shrink: 0;
}

.topbar__user-info {
  display: flex;
  flex-direction: column;
}

.topbar__email {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-neutral-800);
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar__role {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
}

.topbar__logout {
  background: transparent;
  border: 1px solid var(--color-neutral-200);
  color: var(--color-neutral-500);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  transition: all var(--duration-fast);
}

.topbar__logout:hover {
  background-color: var(--color-danger-50);
  border-color: var(--color-danger-100);
  color: var(--color-danger-600);
}
</style>

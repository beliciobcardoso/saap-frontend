<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  PhGridFour, PhCalendarBlank, PhQueue, PhUserCircle,
  PhStethoscope, PhFirstAid, PhUsers, PhClipboardText,
  PhCaretDoubleLeft, PhCaretDoubleRight,
} from '@phosphor-icons/vue'
import { useUiStore } from '@/stores/ui'
import { usePermissions } from '@/composables/usePermissions'

const ui = useUiStore()
const route = useRoute()
const perms = usePermissions()

const navItems = computed(() => [
  { icon: PhGridFour, label: 'Dashboard', path: '/dashboard', show: true },
  { icon: PhCalendarBlank, label: 'Agendamentos', path: '/appointments', show: true },
  { icon: PhQueue, label: 'Fila', path: '/queue', show: perms.canCallNext.value },
  { icon: PhUserCircle, label: 'Pacientes', path: '/patients', show: perms.canManagePatients.value },
  { icon: PhStethoscope, label: 'Profissionais', path: '/professionals', show: perms.canManageProfessionals.value },
  { icon: PhFirstAid, label: 'Serviços', path: '/services', show: perms.canManageServices.value },
  { icon: PhUsers, label: 'Usuários', path: '/users', show: perms.canManageUsers.value },
  { icon: PhClipboardText, label: 'Auditoria', path: '/audit-logs', show: perms.canViewAuditLogs.value },
].filter(i => i.show))

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': ui.sidebarCollapsed }">
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <span class="sidebar__logo-icon">S</span>
        <span v-if="!ui.sidebarCollapsed" class="sidebar__logo-text">SAAP</span>
      </div>
      <button class="sidebar__toggle" @click="ui.toggleSidebar">
        <PhCaretDoubleLeft v-if="!ui.sidebarCollapsed" :size="16" weight="bold" />
        <PhCaretDoubleRight v-else :size="16" weight="bold" />
      </button>
    </div>

    <nav class="sidebar__nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="sidebar__item"
        :class="{ 'sidebar__item--active': isActive(item.path) }"
        :title="ui.sidebarCollapsed ? item.label : undefined"
      >
        <component :is="item.icon" :size="20" weight="regular" class="sidebar__icon" />
        <span v-if="!ui.sidebarCollapsed" class="sidebar__label">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: var(--sidebar-width);
  background-color: var(--color-primary-900);
  color: white;
  display: flex;
  flex-direction: column;
  z-index: var(--z-sticky);
  transition: width var(--duration-normal) var(--ease-in-out);
  overflow: hidden;
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed);
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  height: var(--topbar-height);
  border-bottom: 1px solid rgba(255 255 255 / 0.08);
  flex-shrink: 0;
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sidebar__logo-icon {
  width: 32px;
  height: 32px;
  background-color: var(--color-accent-500);
  color: var(--color-primary-950);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  font-size: var(--text-base);
  flex-shrink: 0;
}

.sidebar__logo-text {
  font-family: var(--font-display);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  letter-spacing: var(--tracking-wide);
}

.sidebar__toggle {
  background: transparent;
  border: none;
  color: rgba(255 255 255 / 0.5);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  transition: color var(--duration-fast);
  flex-shrink: 0;
}

.sidebar__toggle:hover {
  color: white;
}

.sidebar__nav {
  flex: 1;
  padding: var(--space-3) var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  overflow-y: auto;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  color: rgba(255 255 255 / 0.65);
  text-decoration: none;
  transition: all var(--duration-fast);
  white-space: nowrap;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.sidebar__item:hover {
  background-color: rgba(255 255 255 / 0.08);
  color: white;
}

.sidebar__item--active {
  background-color: rgba(255 255 255 / 0.12);
  color: white;
}

.sidebar__icon {
  flex-shrink: 0;
}

.sidebar__label {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

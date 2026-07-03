<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUsers } from '@/composables/queries/useUsers'
import { useDeactivateUser } from '@/composables/mutations/useUserMutations'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import UserForm from '@/components/users/UserForm.vue'
import AppErrorBoundary from '@/components/ui/AppErrorBoundary.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import { PhPlus, PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { UserResponse } from '@/api/types'

const { data: users, isLoading, isError, refetch } = useUsers()
const deactivateMutation = useDeactivateUser()

const searchQuery = ref('')
const showFormModal = ref(false)
const showDeactivateDialog = ref(false)
const deactivatingUser = ref<UserResponse | null>(null)

const columns = [
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Função' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Ações', class: 'text-right' },
]

const filteredUsers = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return users.value ?? []
  return (users.value ?? []).filter(u => u.email.toLowerCase().includes(q))
})

function roleLabel(role: string) {
  const map: Record<string, string> = {
    ADMIN: 'Administrador',
    RECEPTIONIST: 'Recepcionista',
    PROFESSIONAL: 'Profissional',
    ASSISTANT: 'Assistente',
    PATIENT: 'Paciente',
  }
  return map[role] ?? role
}

function handleDeactivate(user: UserResponse) {
  deactivatingUser.value = user
  showDeactivateDialog.value = true
}

function confirmDeactivate() {
  if (!deactivatingUser.value) return
  deactivateMutation.mutate(deactivatingUser.value.id, {
    onSuccess: () => { showDeactivateDialog.value = false },
  })
}
</script>

<template>
  <div class="page">
    <AppErrorBoundary v-if="isError" @retry="refetch" />
    <template v-else>
    <div class="page__header">
      <h1 class="page__title">Usuários</h1>
      <AppButton @click="showFormModal = true">
        <PhPlus :size="16" />
        Novo Usuário
      </AppButton>
    </div>
    <div class="page__search">
      <PhMagnifyingGlass :size="16" class="search-icon" />
      <input v-model="searchQuery" type="text" placeholder="Buscar por email..." class="search-input" />
    </div>
    <AppTable :columns="columns" :loading="isLoading" empty="Nenhum usuário encontrado.">
      <tr v-for="user in filteredUsers" :key="user.id">
        <td><span class="cell-primary">{{ user.email }}</span></td>
        <td>{{ roleLabel(user.role) }}</td>
        <td>
          <span :class="['status-dot', user.active ? 'status-dot--active' : 'status-dot--inactive']">
            {{ user.active ? 'Ativo' : 'Inativo' }}
          </span>
        </td>
        <td class="cell-actions">
          <AppButton v-if="user.active" size="xs" variant="ghost" @click="handleDeactivate(user)">Desativar</AppButton>
        </td>
      </tr>
    </AppTable>
    <UserForm v-model="showFormModal" />
    <ConfirmDialog
      v-model="showDeactivateDialog"
      title="Desativar usuário"
      :message="`Tem certeza que deseja desativar ${deactivatingUser?.email}?`"
      confirm-label="Desativar"
      variant="danger"
      :loading="deactivateMutation.isPending.value"
      @confirm="confirmDeactivate"
    />
    </template>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: var(--space-4); }
.page__header { display: flex; align-items: center; justify-content: space-between; }
.page__title { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: var(--font-semibold); color: var(--color-neutral-900); }
.page__search { position: relative; max-width: 400px; }
.search-icon { position: absolute; left: var(--space-3); top: 50%; transform: translateY(-50%); color: var(--color-neutral-400); }
.search-input { width: 100%; padding: var(--space-2) var(--space-3) var(--space-2) var(--space-10); font-size: var(--text-sm); border: 1px solid var(--color-neutral-300); border-radius: var(--radius-sm); background: white; }
.search-input:focus { outline: none; border-color: var(--color-primary-500); box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15); }
.cell-primary { font-weight: var(--font-medium); color: var(--color-neutral-900); }
.cell-actions { text-align: right; }
.status-dot { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs); font-weight: var(--font-medium); }
.status-dot::before { content: ''; width: 6px; height: 6px; border-radius: var(--radius-full); }
.status-dot--active::before { background: var(--color-success-500); }
.status-dot--active { color: var(--color-success-700); }
.status-dot--inactive::before { background: var(--color-neutral-400); }
.status-dot--inactive { color: var(--color-neutral-500); }
</style>

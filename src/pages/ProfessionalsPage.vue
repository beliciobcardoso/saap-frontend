<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfessionals } from '@/composables/queries/useProfessionals'
import { useDeactivateProfessional } from '@/composables/mutations/useProfessionalMutations'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import ProfessionalForm from '@/components/professionals/ProfessionalForm.vue'
import AppErrorBoundary from '@/components/ui/AppErrorBoundary.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import { formatPhone } from '@/lib/formatters'
import { PhPlus, PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { ProfessionalResponse } from '@/api/types'

const { data: professionals, isLoading, isError, refetch } = useProfessionals()
const deactivateMutation = useDeactivateProfessional()

const searchQuery = ref('')
const showFormModal = ref(false)
const editingProfessional = ref<ProfessionalResponse | null>(null)
const showDeactivateDialog = ref(false)
const deactivatingProfessional = ref<ProfessionalResponse | null>(null)

const columns = [
  { key: 'name', label: 'Nome' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Telefone' },
  { key: 'registration', label: 'Registro' },
  { key: 'role', label: 'Função' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Ações', class: 'text-right' },
]

const filteredProfessionals = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return professionals.value ?? []
  return (professionals.value ?? []).filter(
    p => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
  )
})

function openCreate() {
  editingProfessional.value = null
  showFormModal.value = true
}

function openEdit(professional: ProfessionalResponse) {
  editingProfessional.value = professional
  showFormModal.value = true
}

function handleDeactivate(professional: ProfessionalResponse) {
  deactivatingProfessional.value = professional
  showDeactivateDialog.value = true
}

function confirmDeactivate() {
  if (!deactivatingProfessional.value) return
  deactivateMutation.mutate(deactivatingProfessional.value.id, {
    onSuccess: () => { showDeactivateDialog.value = false },
  })
}

function roleLabel(role: string) {
  return role === 'PROFESSIONAL' ? 'Profissional' : 'Assistente'
}
</script>

<template>
  <div class="page">
    <AppErrorBoundary v-if="isError" @retry="refetch" />
    <template v-else>
    <div class="page__header">
      <h1 class="page__title">Profissionais</h1>
      <AppButton @click="openCreate">
        <PhPlus :size="16" />
        Novo Profissional
      </AppButton>
    </div>

    <div class="page__search">
      <PhMagnifyingGlass :size="16" class="search-icon" />
      <input v-model="searchQuery" type="text" placeholder="Buscar profissional..." class="search-input" />
    </div>

    <AppTable :columns="columns" :loading="isLoading" empty="Nenhum profissional encontrado.">
      <tr v-for="pro in filteredProfessionals" :key="pro.id">
        <td><span class="cell-primary">{{ pro.name }}</span></td>
        <td>{{ pro.email }}</td>
        <td class="cell-mono">{{ formatPhone(pro.phone) }}</td>
        <td class="cell-mono">{{ pro.registrationNumber }}</td>
        <td>{{ roleLabel(pro.role) }}</td>
        <td>
          <span :class="['status-dot', pro.active ? 'status-dot--active' : 'status-dot--inactive']">
            {{ pro.active ? 'Ativo' : 'Inativo' }}
          </span>
        </td>
        <td class="cell-actions">
          <div class="row-actions">
            <AppButton size="xs" variant="ghost" @click="openEdit(pro)">Editar</AppButton>
            <AppButton v-if="pro.active" size="xs" variant="ghost" @click="handleDeactivate(pro)">Desativar</AppButton>
          </div>
        </td>
      </tr>
    </AppTable>

    <ProfessionalForm v-model="showFormModal" :professional="editingProfessional" />

    <ConfirmDialog
      v-model="showDeactivateDialog"
      title="Desativar profissional"
      :message="`Tem certeza que deseja desativar ${deactivatingProfessional?.name}?`"
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
.cell-mono { font-family: var(--font-mono); font-size: var(--text-sm); }
.cell-actions { text-align: right; }
.row-actions { display: flex; gap: var(--space-1); justify-content: flex-end; }
.status-dot { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-xs); font-weight: var(--font-medium); }
.status-dot::before { content: ''; width: 6px; height: 6px; border-radius: var(--radius-full); }
.status-dot--active::before { background: var(--color-success-500); }
.status-dot--active { color: var(--color-success-700); }
.status-dot--inactive::before { background: var(--color-neutral-400); }
.status-dot--inactive { color: var(--color-neutral-500); }
</style>

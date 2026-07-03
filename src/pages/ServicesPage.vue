<script setup lang="ts">
import { ref, computed } from 'vue'
import { useServices } from '@/composables/queries/useServices'
import { useDeactivateService } from '@/composables/mutations/useServiceMutations'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import ServiceForm from '@/components/services/ServiceForm.vue'
import AppErrorBoundary from '@/components/ui/AppErrorBoundary.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import { formatCurrency } from '@/lib/formatters'
import { PhPlus, PhMagnifyingGlass } from '@phosphor-icons/vue'
import type { ServiceResponse } from '@/api/types'

const { data: services, isLoading, isError, refetch } = useServices()
const deactivateMutation = useDeactivateService()

const searchQuery = ref('')
const showFormModal = ref(false)
const editingService = ref<ServiceResponse | null>(null)
const showDeactivateDialog = ref(false)
const deactivatingService = ref<ServiceResponse | null>(null)

const columns = [
  { key: 'name', label: 'Nome' },
  { key: 'description', label: 'Descrição' },
  { key: 'duration', label: 'Duração' },
  { key: 'price', label: 'Preço' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Ações', class: 'text-right' },
]

const filteredServices = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return services.value ?? []
  return (services.value ?? []).filter(s => s.name.toLowerCase().includes(q))
})

function openCreate() { editingService.value = null; showFormModal.value = true }
function openEdit(service: ServiceResponse) { editingService.value = service; showFormModal.value = true }
function handleDeactivate(service: ServiceResponse) { deactivatingService.value = service; showDeactivateDialog.value = true }
function confirmDeactivate() {
  if (!deactivatingService.value) return
  deactivateMutation.mutate(deactivatingService.value.id, { onSuccess: () => { showDeactivateDialog.value = false } })
}
</script>

<template>
  <div class="page">
    <AppErrorBoundary v-if="isError" @retry="refetch" />
    <template v-else>
    <div class="page__header">
      <h1 class="page__title">Serviços</h1>
      <AppButton @click="openCreate"><PhPlus :size="16" /> Novo Serviço</AppButton>
    </div>
    <div class="page__search">
      <PhMagnifyingGlass :size="16" class="search-icon" />
      <input v-model="searchQuery" type="text" placeholder="Buscar serviço..." class="search-input" />
    </div>
    <AppTable :columns="columns" :loading="isLoading" empty="Nenhum serviço encontrado.">
      <tr v-for="svc in filteredServices" :key="svc.id">
        <td><span class="cell-primary">{{ svc.name }}</span></td>
        <td>{{ svc.description || '—' }}</td>
        <td class="cell-mono">{{ svc.durationMinutes }} min</td>
        <td class="cell-mono">{{ formatCurrency(svc.price) }}</td>
        <td><span :class="['status-dot', svc.active ? 'status-dot--active' : 'status-dot--inactive']">{{ svc.active ? 'Ativo' : 'Inativo' }}</span></td>
        <td class="cell-actions">
          <div class="row-actions">
            <AppButton size="xs" variant="ghost" @click="openEdit(svc)">Editar</AppButton>
            <AppButton v-if="svc.active" size="xs" variant="ghost" @click="handleDeactivate(svc)">Desativar</AppButton>
          </div>
        </td>
      </tr>
    </AppTable>
    <ServiceForm v-model="showFormModal" :service="editingService" />
    <ConfirmDialog v-model="showDeactivateDialog" title="Desativar serviço" :message="`Tem certeza que deseja desativar ${deactivatingService?.name}?`" confirm-label="Desativar" variant="danger" :loading="deactivateMutation.isPending.value" @confirm="confirmDeactivate"     />
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

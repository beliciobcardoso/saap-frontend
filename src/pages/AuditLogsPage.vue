<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuditLogs } from '@/composables/queries/useAuditLogs'
import AppTable from '@/components/ui/AppTable.vue'
import AppErrorBoundary from '@/components/ui/AppErrorBoundary.vue'
import { formatDateTime } from '@/lib/formatters'
import type { AuditLogFilters } from '@/api/types'

const filters = ref<AuditLogFilters>({})
const { data: logs, isLoading, isError, refetch } = useAuditLogs(filters)

const columns = [
  { key: 'timestamp', label: 'Data/Hora' },
  { key: 'userId', label: 'Usuário' },
  { key: 'action', label: 'Ação' },
  { key: 'recursoTipo', label: 'Recurso' },
  { key: 'ipAddress', label: 'IP' },
]

const actionLabels: Record<string, string> = {
  LOGIN_USUARIO: 'Login',
  LOGOUT_USUARIO: 'Logout',
  CADASTRO_PACIENTE: 'Cadastro de Paciente',
  ATUALIZACAO_PACIENTE: 'Atualização de Paciente',
  DESATIVACAO_PACIENTE: 'Desativação de Paciente',
  CADASTRO_PROFISSIONAL: 'Cadastro de Profissional',
  ATUALIZACAO_PROFISSIONAL: 'Atualização de Profissional',
  DESATIVACAO_PROFISSIONAL: 'Desativação de Profissional',
  CADASTRO_USUARIO: 'Cadastro de Usuário',
  ATUALIZACAO_USUARIO: 'Atualização de Usuário',
  DESATIVACAO_USUARIO: 'Desativação de Usuário',
  CADASTRO_SERVICO: 'Cadastro de Serviço',
  ATUALIZACAO_SERVICO: 'Atualização de Serviço',
  DESATIVACAO_SERVICO: 'Desativação de Serviço',
  CHECK_IN_VALIDACAO_PRIORIDADE: 'Check-in / Validação de Prioridade',
  CHAMADA_PROXIMO_PACIENTE: 'Chamada do Próximo Paciente',
  CONFIRMACAO_AGENDAMENTO: 'Confirmação de Agendamento',
  CANCELAMENTO_AGENDAMENTO: 'Cancelamento de Agendamento',
  CONFIRMACAO_AGENDAMENTO_POR_EMAIL: 'Confirmação via Email',
  CANCELAMENTO_AGENDAMENTO_POR_EMAIL: 'Cancelamento via Email',
}

function getActionLabel(action: string): string {
  return actionLabels[action] ?? action
}
</script>

<template>
  <div class="page">
    <AppErrorBoundary v-if="isError" @retry="refetch" />
    <template v-else>
    <h1 class="page__title">Logs de Auditoria</h1>

    <div class="page__filters">
      <div class="filters-row">
        <div class="filter-field">
          <label class="filter-label">Usuário</label>
          <input v-model="filters.userId" type="text" class="filter-input" placeholder="UUID do usuário" />
        </div>
        <div class="filter-field">
          <label class="filter-label">Ação</label>
          <select v-model="filters.action" class="filter-input">
            <option value="">Todas</option>
            <option v-for="(label, key) in actionLabels" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>
        <div class="filter-field">
          <label class="filter-label">Recurso</label>
          <select v-model="filters.recursoTipo" class="filter-input">
            <option value="">Todos</option>
            <option value="PATIENT">Paciente</option>
            <option value="PROFESSIONAL">Profissional</option>
            <option value="APPOINTMENT">Agendamento</option>
            <option value="SERVICE">Serviço</option>
            <option value="USER">Usuário</option>
          </select>
        </div>
        <div class="filter-field">
          <label class="filter-label">Data início</label>
          <input v-model="filters.startDate" type="date" class="filter-input" />
        </div>
        <div class="filter-field">
          <label class="filter-label">Data fim</label>
          <input v-model="filters.endDate" type="date" class="filter-input" />
        </div>
      </div>
    </div>

    <AppTable :columns="columns" :loading="isLoading" empty="Nenhum log de auditoria encontrado.">
      <tr v-for="log in logs" :key="log.id">
        <td class="cell-mono">{{ formatDateTime(log.timestamp) }}</td>
        <td class="cell-mono cell-sm">{{ log.userId }}</td>
        <td>{{ getActionLabel(log.action) }}</td>
        <td>{{ log.recursoTipo }}</td>
        <td class="cell-mono cell-sm">{{ log.ipAddress }}</td>
      </tr>
    </AppTable>
    </template>
  </div>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: var(--space-4); }
.page__title { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: var(--font-semibold); color: var(--color-neutral-900); }
.page__filters { background: var(--color-bg-surface); border: 1px solid var(--color-neutral-200); border-radius: var(--radius-lg); padding: var(--space-4); }
.filters-row { display: flex; gap: var(--space-4); align-items: flex-end; flex-wrap: wrap; }
.filter-field { display: flex; flex-direction: column; gap: var(--space-1); }
.filter-label { font-size: var(--text-xs); font-weight: var(--font-medium); color: var(--color-neutral-600); }
.filter-input { padding: var(--space-2) var(--space-3); font-size: var(--text-sm); border: 1px solid var(--color-neutral-300); border-radius: var(--radius-sm); background: white; color: var(--color-neutral-900); }
.filter-input:focus { outline: none; border-color: var(--color-primary-500); box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15); }
.cell-mono { font-family: var(--font-mono); font-size: var(--text-sm); }
.cell-sm { font-size: var(--text-xs); }
</style>

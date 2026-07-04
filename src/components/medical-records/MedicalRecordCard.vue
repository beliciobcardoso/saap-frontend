<script setup lang="ts">
import { computed } from 'vue'
import type { MedicalRecordEntryResponse } from '@/api/types'
import { formatDateTime } from '@/lib/formatters'
import { useProfessionals } from '@/composables/queries/useProfessionals'
import AppEmptyState from '@/components/ui/AppEmptyState.vue'
import { PhStethoscope } from '@phosphor-icons/vue'

interface Props {
  entries: MedicalRecordEntryResponse[]
}

const props = defineProps<Props>()

const { data: professionals } = useProfessionals()

function getProfessionalName(id: string): string {
  return professionals.value?.find(p => p.id === id)?.name ?? 'Profissional desconhecido'
}

const sortedEntries = computed(() =>
  [...props.entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
)
</script>

<template>
  <div class="medical-record">
    <template v-if="entries.length === 0">
      <AppEmptyState
        title="Prontuário vazio"
        description="Nenhuma evolução clínica registrada para este paciente."
      >
        <template #icon>
          <PhStethoscope :size="48" />
        </template>
      </AppEmptyState>
    </template>

    <template v-else>
      <div v-for="entry in sortedEntries" :key="entry.id" class="entry">
        <div class="entry__header">
          <span class="entry__professional">{{ getProfessionalName(entry.professionalId) }}</span>
          <span class="entry__date">{{ formatDateTime(entry.createdAt) }}</span>
        </div>
        <div class="entry__evolution">{{ entry.evolution }}</div>
        <div v-if="entry.updatedAt !== entry.createdAt" class="entry__edited">
          Editado: {{ formatDateTime(entry.updatedAt) }}
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.medical-record {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.entry {
  padding: var(--space-4);
  background: var(--color-bg-sunken);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-neutral-200);
}

.entry__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.entry__professional {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-primary-600);
}

.entry__date {
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--color-neutral-500);
}

.entry__evolution {
  font-size: var(--text-sm);
  color: var(--color-neutral-800);
  line-height: var(--leading-relaxed);
  white-space: pre-wrap;
}

.entry__edited {
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
  margin-top: var(--space-2);
  font-style: italic;
}
</style>

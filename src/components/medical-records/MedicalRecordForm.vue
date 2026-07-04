<script setup lang="ts">
import { ref } from 'vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'

interface Props {
  modelValue: boolean
  appointmentId: string
  entryId?: string
  initialEvolution?: string
}

const props = withDefaults(defineProps<Props>(), {
  entryId: undefined,
  initialEvolution: '',
})

const emit = defineEmits<{ 'update:modelValue': [value: boolean]; save: [evolution: string] }>()

const evolution = ref(props.initialEvolution)
const isEditing = ref(!!props.entryId)

function close() {
  evolution.value = ''
  emit('update:modelValue', false)
}

function save() {
  if (!evolution.value.trim()) return
  emit('save', evolution.value)
}
</script>

<template>
  <AppModal
    :model-value="modelValue"
    @update:model-value="close"
    :title="isEditing ? 'Editar Evolução Clínica' : 'Nova Evolução Clínica'"
    size="lg"
  >
    <div class="medical-form">
      <div class="field">
        <label class="field__label">Evolução clínica <span class="required">*</span></label>
        <textarea
          v-model="evolution"
          class="field__textarea"
          rows="8"
          placeholder="Descreva a evolução clínica do paciente..."
        />
      </div>
    </div>

    <template #footer>
      <AppButton variant="ghost" @click="close">Cancelar</AppButton>
      <AppButton @click="save" :disabled="!evolution.trim()">
        {{ isEditing ? 'Salvar' : 'Registrar' }}
      </AppButton>
    </template>
  </AppModal>
</template>

<style scoped>
.medical-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.field__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-neutral-700);
}

.required {
  color: var(--color-danger-500);
}

.field__textarea {
  width: 100%;
  padding: var(--space-3);
  font-size: var(--text-sm);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  background: white;
  color: var(--color-neutral-900);
  resize: vertical;
  font-family: var(--font-body);
  line-height: var(--leading-relaxed);
  transition: all var(--duration-fast);
}

.field__textarea:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15);
}
</style>

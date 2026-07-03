<script setup lang="ts">
import { ref, computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useCheckIn } from '@/composables/mutations/useAppointmentMutations'
import { useProfessionals } from '@/composables/queries/useProfessionals'
import type { PriorityLevel } from '@/api/types'
import * as yup from 'yup'

interface Props {
  modelValue: boolean
  appointmentId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const checkInMutation = useCheckIn()
const { data: professionals } = useProfessionals()

const professionalOptions = computed(() =>
  (professionals.value ?? [])
    .filter(p => p.role === 'PROFESSIONAL')
    .map(p => ({ value: p.id, label: p.name }))
)

const priorityOptions: { value: PriorityLevel; label: string }[] = [
  { value: 'P1', label: 'P1 — Crítico' },
  { value: 'P2', label: 'P2 — Urgente' },
  { value: 'P3', label: 'P3 — Moderado' },
  { value: 'P4', label: 'P4 — Baixo' },
  { value: 'P5', label: 'P5 — Padrão' },
]

const checkInSchema = yup.object({
  verifiedPriority: yup.string().oneOf(['P1', 'P2', 'P3', 'P4', 'P5']).required('Prioridade é obrigatória'),
  verifiedBy: yup.string().required('Profissional é obrigatório'),
  notes: yup.string().nullable(),
})

function close() {
  emit('update:modelValue', false)
}

const onSubmit = (values: any) => {
  checkInMutation.mutate(
    {
      id: props.appointmentId,
      data: {
        verifiedLevel: values.verifiedPriority as PriorityLevel,
        verifiedBy: values.verifiedBy,
        notes: values.notes || undefined,
      },
    },
    { onSuccess: () => close() }
  )
}
</script>

<template>
  <AppModal :model-value="modelValue" @update:model-value="close" title="Check-in / Validação de Prioridade" size="md">
    <Form :validation-schema="checkInSchema" @submit="onSubmit" class="checkin-form">
      <div class="form-fields">
        <div class="field">
          <label class="field__label">Prioridade verificada <span class="required">*</span></label>
          <Field name="verifiedPriority" as="select" class="field__select">
            <option value="" disabled>Selecione a prioridade</option>
            <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </Field>
          <ErrorMessage name="verifiedPriority" class="field__error" />
        </div>

        <div class="field">
          <label class="field__label">Validado por <span class="required">*</span></label>
          <Field name="verifiedBy" as="select" class="field__select">
            <option value="" disabled>Selecione o profissional</option>
            <option v-for="opt in professionalOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </Field>
          <ErrorMessage name="verifiedBy" class="field__error" />
        </div>

        <div class="field">
          <label class="field__label">Notas</label>
          <Field name="notes" as="textarea" class="field__textarea" rows="3" placeholder="Observações sobre a validação..." />
        </div>
      </div>

      <div class="form-footer">
        <AppButton variant="ghost" @click="close" type="button">Cancelar</AppButton>
        <AppButton type="submit" :loading="checkInMutation.isPending.value">Confirmar Check-in</AppButton>
      </div>
    </Form>
  </AppModal>
</template>

<style scoped>
.form-fields { display: flex; flex-direction: column; gap: var(--space-4); }
.field { display: flex; flex-direction: column; gap: var(--space-1); }
.field__label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-neutral-700); }
.required { color: var(--color-danger-500); }
.field__select, .field__textarea { width: 100%; padding: var(--space-2) var(--space-3); font-size: var(--text-sm); border: 1px solid var(--color-neutral-300); border-radius: var(--radius-sm); background: white; color: var(--color-neutral-900); transition: all var(--duration-fast); }
.field__select:focus, .field__textarea:focus { outline: none; border-color: var(--color-primary-500); box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15); }
.field__textarea { resize: vertical; }
.field__error { font-size: var(--text-xs); color: var(--color-danger-600); }
.form-footer { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--color-neutral-200); }
</style>

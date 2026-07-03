<script setup lang="ts">
import { ref, computed } from 'vue'

import { Form, Field, ErrorMessage } from 'vee-validate'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { useAppointmentForm } from '@/composables/forms/useAppointmentForm'
import { useBookAppointment } from '@/composables/mutations/useAppointmentMutations'
import { toast } from 'vue-sonner'
import { usePatients } from '@/composables/queries/usePatients'
import { useProfessionals } from '@/composables/queries/useProfessionals'
import { useServices } from '@/composables/queries/useServices'
import type { PaymentMethod, PriorityLevel } from '@/api/types'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { handleSubmit, values } = useAppointmentForm()
const bookMutation = useBookAppointment()

const { data: patients } = usePatients()
const { data: professionals } = useProfessionals()
const { data: services } = useServices()

const patientOptions = computed(() =>
  (patients.value ?? []).map(p => ({ value: p.id, label: `${p.name} — ${p.cpf}` }))
)

const professionalOptions = computed(() =>
  (professionals.value ?? []).map(p => ({ value: p.id, label: p.name }))
)

const serviceOptions = computed(() =>
  (services.value ?? []).map(s => ({ value: s.id, label: `${s.name} (${s.durationMinutes}min)` }))
)

const paymentOptions = [
  { value: 'PIX', label: 'Pix' },
  { value: 'DINHEIRO', label: 'Dinheiro' },
  { value: 'CARTAO', label: 'Cartão' },
  { value: 'CHEQUE', label: 'Cheque' },
]

const priorityOptions = [
  { value: 'P1', label: 'P1 — Crítico' },
  { value: 'P2', label: 'P2 — Urgente' },
  { value: 'P3', label: 'P3 — Moderado' },
  { value: 'P4', label: 'P4 — Baixo' },
  { value: 'P5', label: 'P5 — Padrão' },
]

const conflictError = ref(false)

const onSubmit = handleSubmit((formValues) => {
  conflictError.value = false
  bookMutation.mutate(formValues, {
    onSuccess: () => {
      emit('update:modelValue', false)
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        conflictError.value = true
        toast.error('Conflito de horário', {
          description: 'Profissional já tem agendamento neste horário.',
        })
      }
    },
  })
})

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <AppModal :model-value="modelValue" @update:model-value="close" title="Novo Agendamento" size="lg">
    <Form @submit="onSubmit" class="book-form">
      <div class="book-form__grid">
        <div class="field">
          <label class="field__label">Paciente <span class="required">*</span></label>
          <Field name="patientId" v-slot="{ field }">
            <select v-bind="field" class="field__select">
              <option value="" disabled>Selecione o paciente</option>
              <option v-for="opt in patientOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </Field>
          <ErrorMessage name="patientId" class="field__error" />
        </div>

        <div class="field">
          <label class="field__label">Profissional <span class="required">*</span></label>
          <Field name="professionalId" v-slot="{ field }">
            <select v-bind="field" class="field__select">
              <option value="" disabled>Selecione o profissional</option>
              <option v-for="opt in professionalOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </Field>
          <ErrorMessage name="professionalId" class="field__error" />
        </div>

        <div class="field">
          <label class="field__label">Serviço <span class="required">*</span></label>
          <Field name="serviceId" v-slot="{ field }">
            <select v-bind="field" class="field__select">
              <option value="" disabled>Selecione o serviço</option>
              <option v-for="opt in serviceOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </Field>
          <ErrorMessage name="serviceId" class="field__error" />
        </div>

        <div class="field">
          <label class="field__label">Data e hora <span class="required">*</span></label>
          <Field name="dateTime" type="datetime-local" class="field__input" />
          <ErrorMessage name="dateTime" class="field__error" />
        </div>

        <div class="field">
          <label class="field__label">Pagamento <span class="required">*</span></label>
          <Field name="paymentMethod" v-slot="{ field }">
            <select v-bind="field" class="field__select">
              <option v-for="opt in paymentOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </Field>
          <ErrorMessage name="paymentMethod" class="field__error" />
        </div>

        <div class="field">
          <label class="field__label">Prioridade declarada</label>
          <Field name="declaredPriority" v-slot="{ field }">
            <select v-bind="field" class="field__select">
              <option value="">Não informar</option>
              <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </Field>
          <ErrorMessage name="declaredPriority" class="field__error" />
        </div>
      </div>

      <div v-if="conflictError" class="book-form__conflict">
        Conflito de horário. O profissional já possui agendamento neste horário. Altere a data/hora e tente novamente.
      </div>

      <div class="book-form__footer">
        <AppButton variant="ghost" @click="close" type="button">Cancelar</AppButton>
        <AppButton type="submit" :loading="bookMutation.isPending.value">Agendar</AppButton>
      </div>
    </Form>
  </AppModal>
</template>

<style scoped>
.book-form__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.book-form__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-neutral-200);
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

.field__input,
.field__select {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  background: white;
  color: var(--color-neutral-900);
  transition: all var(--duration-fast);
}

.field__input:focus,
.field__select:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15);
}

.field__error {
  font-size: var(--text-xs);
  color: var(--color-danger-600);
}

.book-form__conflict {
  background: var(--color-warning-100);
  color: var(--color-warning-700);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  margin-top: var(--space-4);
  border: 1px solid var(--color-accent-400);
}
</style>

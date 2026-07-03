<script setup lang="ts">
import { computed, watch } from 'vue'
import { Form, Field, ErrorMessage, useField } from 'vee-validate'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useCreatePatient, useUpdatePatient } from '@/composables/mutations/usePatientMutations'
import type { PatientResponse, PatientRequest } from '@/api/types'

interface Props {
  modelValue: boolean
  patient?: PatientResponse | null
}

const props = withDefaults(defineProps<Props>(), { patient: null })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const isEditing = computed(() => !!props.patient)

function formatCpfDisplay(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return d.slice(0, 3) + '.' + d.slice(3)
  if (d.length <= 9) return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6)
  return d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9)
}

function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? '(' + d : ''
  if (d.length <= 3) return '(' + d.slice(0, 2) + ') ' + d.slice(2)
  if (d.length <= 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 3) + ' ' + d.slice(3)
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 3) + ' ' + d.slice(3, 7) + '-' + d.slice(7)
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 3) + ' ' + d.slice(3, 7) + '-' + d.slice(7)
}

function stripMask(val: string): string {
  return val.replace(/\D/g, '')
}

const schema = computed(() => ({
  name: (v: string) => !!v?.trim() || 'Nome é obrigatório',
  cpf: (v: string) => {
    const digits = stripMask(v)
    if (!digits) return 'CPF é obrigatório'
    if (digits.length !== 11) return 'CPF deve ter 11 dígitos'
    return true
  },
  phone: (v: string) => {
    const digits = stripMask(v)
    if (!digits) return 'Telefone é obrigatório'
    if (digits.length < 10) return 'Telefone inválido'
    return true
  },
  birthDate: (v: string) => {
    if (!v) return 'Data de nascimento é obrigatória'
    if (new Date(v) >= new Date()) return 'Data deve ser no passado'
    return true
  },
}))

const createMutation = useCreatePatient()
const updateMutation = useUpdatePatient()

function close() {
  emit('update:modelValue', false)
}

const initialCpf = props.patient ? stripMask(props.patient.cpf) : ''
const initialPhone = props.patient ? stripMask(props.patient.phone) : ''

function handleCpfInput(e: Event, handleChange: (val: string) => void) {
  const input = e.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '').slice(0, 11)
  input.value = formatCpfDisplay(digits)
  handleChange(input.value)
}

function handlePhoneInput(e: Event, handleChange: (val: string) => void) {
  const input = e.target as HTMLInputElement
  const digits = input.value.replace(/\D/g, '').slice(0, 11)
  input.value = formatPhoneDisplay(digits)
  handleChange(input.value)
}

function onSubmit(values: any) {
  const data: PatientRequest = {
    name: values.name,
    cpf: stripMask(values.cpf),
    phone: stripMask(values.phone),
    birthDate: values.birthDate,
    susNumber: values.susNumber || undefined,
    email: values.email || undefined,
  }

  if (isEditing.value && props.patient) {
    updateMutation.mutate(
      { id: props.patient.id, data },
      { onSuccess: () => close() }
    )
  } else {
    createMutation.mutate(data, { onSuccess: () => close() })
  }
}
</script>

<template>
  <AppModal
    :model-value="modelValue"
    @update:model-value="close"
    :title="isEditing ? 'Editar Paciente' : 'Novo Paciente'"
    size="lg"
  >
    <Form
      :initial-values="{
        name: patient?.name ?? '',
        cpf: formatCpfDisplay(initialCpf),
        susNumber: patient?.susNumber ?? '',
        phone: formatPhoneDisplay(initialPhone),
        email: patient?.email ?? '',
        birthDate: patient?.birthDate ?? '',
      }"
      :validation-schema="schema"
      @submit="onSubmit"
      class="patient-form"
    >
      <div class="form-grid">
        <div class="field field--full">
          <label class="field__label">Nome <span class="required">*</span></label>
          <Field name="name" class="field__input" placeholder="Nome completo" />
          <ErrorMessage name="name" class="field__error" />
        </div>

        <div class="field">
          <label class="field__label">CPF <span class="required">*</span></label>
          <Field name="cpf" v-slot="{ field, handleChange }">
            <input
              v-bind="field"
              class="field__input"
              placeholder="000.000.000-00"
              maxlength="14"
              @input="handleCpfInput($event, handleChange)"
            />
          </Field>
          <ErrorMessage name="cpf" class="field__error" />
        </div>

        <div class="field">
          <label class="field__label">Cartão SUS</label>
          <Field name="susNumber" class="field__input" placeholder="000 0000 0000 0000" maxlength="15" />
          <ErrorMessage name="susNumber" class="field__error" />
        </div>

        <div class="field">
          <label class="field__label">Telefone <span class="required">*</span></label>
          <Field name="phone" v-slot="{ field, handleChange }">
            <input
              v-bind="field"
              class="field__input"
              placeholder="(00) 0 0000-0000"
              maxlength="16"
              @input="handlePhoneInput($event, handleChange)"
            />
          </Field>
          <ErrorMessage name="phone" class="field__error" />
        </div>

        <div class="field">
          <label class="field__label">Email</label>
          <Field name="email" type="email" class="field__input" placeholder="email@exemplo.com" />
          <ErrorMessage name="email" class="field__error" />
        </div>

        <div class="field field--full">
          <label class="field__label">Data de nascimento <span class="required">*</span></label>
          <Field name="birthDate" type="date" class="field__input" :max="new Date().toISOString().split('T')[0]" />
          <ErrorMessage name="birthDate" class="field__error" />
        </div>
      </div>

      <div class="form-footer">
        <AppButton variant="ghost" @click="close" type="button">Cancelar</AppButton>
        <AppButton type="submit" :loading="createMutation.isPending.value || updateMutation.isPending.value">
          {{ isEditing ? 'Salvar' : 'Cadastrar' }}
        </AppButton>
      </div>
    </Form>
  </AppModal>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.field--full {
  grid-column: 1 / -1;
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

.field__input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-sm);
  background: white;
  color: var(--color-neutral-900);
  transition: all var(--duration-fast);
}

.field__input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15);
}

.field__error {
  font-size: var(--text-xs);
  color: var(--color-danger-600);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-neutral-200);
}
</style>

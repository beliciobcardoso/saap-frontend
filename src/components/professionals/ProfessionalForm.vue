<script setup lang="ts">
import { computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useCreateProfessional, useUpdateProfessional } from '@/composables/mutations/useProfessionalMutations'
import type { ProfessionalResponse } from '@/api/types'
import * as yup from 'yup'

interface Props {
  modelValue: boolean
  professional?: ProfessionalResponse | null
}

const props = withDefaults(defineProps<Props>(), { professional: null })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const isEditing = computed(() => !!props.professional)

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(3, 'Mínimo 3 caracteres'),
  email: yup.string().required('Email é obrigatório').email('Email inválido'),
  phone: yup.string().required('Telefone é obrigatório'),
  registrationNumber: yup.string().required('Registro profissional é obrigatório'),
  role: yup.string().oneOf(['PROFESSIONAL', 'ASSISTANT']).required('Função é obrigatória'),
})

const createMutation = useCreateProfessional()
const updateMutation = useUpdateProfessional()

function close() { emit('update:modelValue', false) }

function onSubmit(values: any) {
  if (isEditing.value && props.professional) {
    updateMutation.mutate(
      { id: props.professional.id, data: values },
      { onSuccess: () => close() }
    )
  } else {
    createMutation.mutate(values, { onSuccess: () => close() })
  }
}
</script>

<template>
  <AppModal :model-value="modelValue" @update:model-value="close" :title="isEditing ? 'Editar Profissional' : 'Novo Profissional'" size="lg">
    <Form
      :validation-schema="schema"
      :initial-values="{
        name: professional?.name ?? '',
        email: professional?.email ?? '',
        phone: professional?.phone ?? '',
        registrationNumber: professional?.registrationNumber ?? '',
        role: professional?.role ?? 'PROFESSIONAL',
      }"
      @submit="onSubmit"
      class="pro-form"
    >
      <div class="form-grid">
        <div class="field field--full">
          <label class="field__label">Nome <span class="required">*</span></label>
          <Field name="name" class="field__input" placeholder="Nome completo" />
          <ErrorMessage name="name" class="field__error" />
        </div>
        <div class="field">
          <label class="field__label">Email <span class="required">*</span></label>
          <Field name="email" type="email" class="field__input" placeholder="email@exemplo.com" />
          <ErrorMessage name="email" class="field__error" />
        </div>
        <div class="field">
          <label class="field__label">Telefone <span class="required">*</span></label>
          <Field name="phone" class="field__input" placeholder="(00) 0 0000-0000" />
          <ErrorMessage name="phone" class="field__error" />
        </div>
        <div class="field">
          <label class="field__label">Registro profissional <span class="required">*</span></label>
          <Field name="registrationNumber" class="field__input" placeholder="CRM, CRO, etc." />
          <ErrorMessage name="registrationNumber" class="field__error" />
        </div>
        <div class="field">
          <label class="field__label">Função <span class="required">*</span></label>
          <Field name="role" as="select" class="field__select">
            <option value="PROFESSIONAL">Profissional</option>
            <option value="ASSISTANT">Assistente</option>
          </Field>
          <ErrorMessage name="role" class="field__error" />
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
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
.field--full { grid-column: 1 / -1; }
.field { display: flex; flex-direction: column; gap: var(--space-1); }
.field__label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-neutral-700); }
.required { color: var(--color-danger-500); }
.field__input, .field__select { width: 100%; padding: var(--space-2) var(--space-3); font-size: var(--text-sm); border: 1px solid var(--color-neutral-300); border-radius: var(--radius-sm); background: white; color: var(--color-neutral-900); transition: all var(--duration-fast); }
.field__input:focus, .field__select:focus { outline: none; border-color: var(--color-primary-500); box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15); }
.field__error { font-size: var(--text-xs); color: var(--color-danger-600); }
.form-footer { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--color-neutral-200); }
</style>

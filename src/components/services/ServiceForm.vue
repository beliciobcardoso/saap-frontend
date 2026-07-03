<script setup lang="ts">
import { computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useCreateService, useUpdateService } from '@/composables/mutations/useServiceMutations'
import type { ServiceResponse } from '@/api/types'
import * as yup from 'yup'

interface Props {
  modelValue: boolean
  service?: ServiceResponse | null
}

const props = withDefaults(defineProps<Props>(), { service: null })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const isEditing = computed(() => !!props.service)

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório').min(2, 'Mínimo 2 caracteres'),
  description: yup.string().nullable(),
  durationMinutes: yup.number().required('Duração é obrigatória').min(5, 'Mínimo 5 minutos').max(480, 'Máximo 8 horas'),
  price: yup.number().required('Preço é obrigatório').min(0, 'Preço não pode ser negativo'),
})

const createMutation = useCreateService()
const updateMutation = useUpdateService()

function close() { emit('update:modelValue', false) }

function onSubmit(values: any) {
  if (isEditing.value && props.service) {
    updateMutation.mutate(
      { id: props.service.id, data: values },
      { onSuccess: () => close() }
    )
  } else {
    createMutation.mutate(values, { onSuccess: () => close() })
  }
}
</script>

<template>
  <AppModal :model-value="modelValue" @update:model-value="close" :title="isEditing ? 'Editar Serviço' : 'Novo Serviço'" size="md">
    <Form
      :validation-schema="schema"
      :initial-values="{
        name: service?.name ?? '',
        description: service?.description ?? '',
        durationMinutes: service?.durationMinutes ?? 30,
        price: service?.price ?? 0,
      }"
      @submit="onSubmit"
      class="svc-form"
    >
      <div class="form-fields">
        <div class="field">
          <label class="field__label">Nome <span class="required">*</span></label>
          <Field name="name" class="field__input" placeholder="Nome do serviço" />
          <ErrorMessage name="name" class="field__error" />
        </div>
        <div class="field">
          <label class="field__label">Descrição</label>
          <Field name="description" as="textarea" class="field__textarea" rows="2" placeholder="Descrição opcional" />
        </div>
        <div class="field-row">
          <div class="field">
            <label class="field__label">Duração (min) <span class="required">*</span></label>
            <Field name="durationMinutes" type="number" class="field__input" />
            <ErrorMessage name="durationMinutes" class="field__error" />
          </div>
          <div class="field">
            <label class="field__label">Preço (R$) <span class="required">*</span></label>
            <Field name="price" type="number" step="0.01" class="field__input" />
            <ErrorMessage name="price" class="field__error" />
          </div>
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
.form-fields { display: flex; flex-direction: column; gap: var(--space-4); }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
.field { display: flex; flex-direction: column; gap: var(--space-1); }
.field__label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-neutral-700); }
.required { color: var(--color-danger-500); }
.field__input, .field__textarea { width: 100%; padding: var(--space-2) var(--space-3); font-size: var(--text-sm); border: 1px solid var(--color-neutral-300); border-radius: var(--radius-sm); background: white; color: var(--color-neutral-900); transition: all var(--duration-fast); }
.field__input:focus, .field__textarea:focus { outline: none; border-color: var(--color-primary-500); box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15); }
.field__textarea { resize: vertical; }
.field__error { font-size: var(--text-xs); color: var(--color-danger-600); }
.form-footer { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--color-neutral-200); }
</style>

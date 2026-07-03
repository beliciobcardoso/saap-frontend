<script setup lang="ts">
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import AppModal from '@/components/ui/AppModal.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useUserForm } from '@/composables/forms/useUserForm'
import { useCreateUser } from '@/composables/mutations/useUserMutations'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { handleSubmit } = useUserForm()
const createMutation = useCreateUser()

function close() { emit('update:modelValue', false) }

const onSubmit = handleSubmit((values) => {
  createMutation.mutate(values, { onSuccess: () => close() })
})
</script>

<template>
  <AppModal :model-value="modelValue" @update:model-value="close" title="Novo Usuário" size="md">
    <Form @submit="onSubmit" class="user-form">
      <div class="form-fields">
        <div class="field">
          <label class="field__label">Email <span class="required">*</span></label>
          <Field name="email" type="email" class="field__input" placeholder="email@exemplo.com" />
          <ErrorMessage name="email" class="field__error" />
        </div>
        <div class="field">
          <label class="field__label">Senha <span class="required">*</span></label>
          <Field name="password" type="password" class="field__input" placeholder="Mínimo 6 caracteres" />
          <ErrorMessage name="password" class="field__error" />
        </div>
        <div class="field">
          <label class="field__label">Função <span class="required">*</span></label>
          <Field name="role" as="select" class="field__select">
            <option value="ADMIN">Administrador</option>
            <option value="RECEPTIONIST">Recepcionista</option>
            <option value="PROFESSIONAL">Profissional</option>
            <option value="ASSISTANT">Assistente</option>
            <option value="PATIENT">Paciente</option>
          </Field>
          <ErrorMessage name="role" class="field__error" />
        </div>
      </div>
      <div class="form-footer">
        <AppButton variant="ghost" @click="close" type="button">Cancelar</AppButton>
        <AppButton type="submit" :loading="createMutation.isPending.value">Cadastrar</AppButton>
      </div>
    </Form>
  </AppModal>
</template>

<style scoped>
.form-fields { display: flex; flex-direction: column; gap: var(--space-4); }
.field { display: flex; flex-direction: column; gap: var(--space-1); }
.field__label { font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-neutral-700); }
.required { color: var(--color-danger-500); }
.field__input, .field__select { width: 100%; padding: var(--space-2) var(--space-3); font-size: var(--text-sm); border: 1px solid var(--color-neutral-300); border-radius: var(--radius-sm); background: white; color: var(--color-neutral-900); transition: all var(--duration-fast); }
.field__input:focus, .field__select:focus { outline: none; border-color: var(--color-primary-500); box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15); }
.field__error { font-size: var(--text-xs); color: var(--color-danger-600); }
.form-footer { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--color-neutral-200); }
</style>

<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue?: string | number
  label?: string
  options: Option[]
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

withDefaults(defineProps<Props>(), { placeholder: 'Selecione...' })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="select-wrap">
    <label v-if="label" class="select-label">
      {{ label }}
      <span v-if="required" class="select-required">*</span>
    </label>
    <select
      :value="modelValue"
      :disabled="disabled"
      :class="['select-field', { 'select-field--error': !!error }]"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled :selected="!modelValue">{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >{{ opt.label }}</option>
    </select>
    <span v-if="error" class="select-error">{{ error }}</span>
  </div>
</template>

<style scoped>
.select-wrap { @apply flex flex-col gap-1; }
.select-label { @apply text-sm font-medium text-[var(--color-neutral-700)]; }
.select-required { @apply text-[var(--color-danger-500)] ml-0.5; }
.select-field {
  @apply w-full px-3 py-2 text-sm rounded border
         border-[var(--color-neutral-300)] bg-white
         text-[var(--color-neutral-900)]
         focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]
         focus:border-transparent
         disabled:bg-[var(--color-neutral-100)]
         disabled:cursor-not-allowed
         transition-all appearance-none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2rem;
}
.select-field--error { @apply border-[var(--color-danger-500)] focus:ring-[var(--color-danger-500)]; }
.select-error { @apply text-xs text-[var(--color-danger-600)]; }
</style>

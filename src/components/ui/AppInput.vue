<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), { type: 'text' })
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="input-wrap">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['input-field', { 'input-field--error': !!error }]"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-wrap { @apply flex flex-col gap-1; }

.input-label {
  @apply text-sm font-medium text-[var(--color-neutral-700)];
}

.input-required { @apply text-[var(--color-danger-500)] ml-0.5; }

.input-field {
  @apply w-full px-3 py-2 text-sm rounded border
         border-[var(--color-neutral-300)] bg-white
         text-[var(--color-neutral-900)]
         placeholder-[var(--color-neutral-400)]
         focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]
         focus:border-transparent
         disabled:bg-[var(--color-neutral-100)]
         disabled:cursor-not-allowed
         transition-all;
}

.input-field--error {
  @apply border-[var(--color-danger-500)] focus:ring-[var(--color-danger-500)];
}

.input-error {
  @apply text-xs text-[var(--color-danger-600)];
}
</style>

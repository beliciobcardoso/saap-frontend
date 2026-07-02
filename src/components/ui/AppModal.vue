<script setup lang="ts">
import { PhX } from '@phosphor-icons/vue'

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

withDefaults(defineProps<Props>(), { size: 'md' })
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div :class="['modal', `modal--${size}`]">
          <div v-if="title" class="modal__header">
            <h2 class="modal__title">{{ title }}</h2>
            <button class="modal__close" @click="close">
              <PhX :size="20" />
            </button>
          </div>
          <div class="modal__body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--color-bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
}

.modal {
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-height: calc(100vh - var(--space-8));
  overflow-y: auto;
}

.modal--sm  { max-width: 400px; }
.modal--md  { max-width: 560px; }
.modal--lg  { max-width: 720px; }
.modal--xl  { max-width: 960px; }

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-neutral-200);
}

.modal__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.modal__close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--color-neutral-500);
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  transition: color var(--duration-fast);
}

.modal__close:hover { color: var(--color-neutral-900); }

.modal__body { padding: var(--space-6); }

.modal__footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-neutral-200);
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out);
}
.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform var(--duration-normal) var(--ease-out);
}
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-from .modal { transform: scale(0.95) translateY(-8px); }
.modal-leave-to  .modal { transform: scale(0.95) translateY(-8px); }
</style>

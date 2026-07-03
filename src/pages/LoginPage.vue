<template>
  <div class="login-page">
    <div class="login-brand">
      <div class="login-brand__content">
        <div class="login-brand__logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="white" fill-opacity="0.15" />
            <path d="M14 24h20M24 14v20" stroke="white" stroke-width="3" stroke-linecap="round" />
          </svg>
          <span class="login-brand__name">SAAP</span>
        </div>
        <h1 class="login-brand__title">Gestão clínica inteligente</h1>
        <p class="login-brand__subtitle">
          Sistema de Agendamento e Atendimento Priorizado para clínicas brasileiras.
        </p>
      </div>
    </div>

    <div class="login-form-side">
      <div class="login-form-container">
        <div class="login-form-header">
          <h2>Bem-vindo de volta</h2>
          <p>Entre com suas credenciais para acessar o sistema.</p>
        </div>

        <Form @submit="handleLogin" :validation-schema="schema" v-slot="{ errors, isSubmitting }">
          <div class="login-form-fields">
            <div class="field">
              <label for="email" class="field__label">Email</label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                :class="['field__input', { 'field__input--error': errors.email }]"
                autocomplete="email"
              />
              <ErrorMessage name="email" class="field__error" />
            </div>

            <div class="field">
              <label for="password" class="field__label">Senha</label>
              <div class="field__password-wrap">
                <Field
                  id="password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Sua senha"
                  :class="['field__input', 'field__input--password', { 'field__input--error': errors.password }]"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="field__toggle-password"
                  @click="showPassword = !showPassword"
                  tabindex="-1"
                >
                  <PhEye v-if="!showPassword" :size="18" />
                  <PhEyeSlash v-else :size="18" />
                </button>
              </div>
              <ErrorMessage name="password" class="field__error" />
            </div>
          </div>

          <div v-if="loginError" class="login-error">
            {{ loginError }}
          </div>

          <button
            type="submit"
            class="login-submit"
            :disabled="isSubmitting"
          >
            <PhCircleNotch v-if="isSubmitting" class="login-submit__spinner" :size="18" weight="bold" />
            <span v-if="isSubmitting">Entrando...</span>
            <span v-else>Entrar</span>
          </button>
        </Form>

        <div class="login-footer">
          <span>SAAP v1.0</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { PhEye, PhEyeSlash, PhCircleNotch } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

const schema = yup.object({
  email: yup.string().required('Email é obrigatório').email('Email inválido'),
  password: yup.string().required('Senha é obrigatória').min(6, 'Mínimo 6 caracteres'),
})

const showPassword = ref(false)
const loginError = ref('')

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()


async function handleLogin(values: { email: string; password: string }) {
  loginError.value = ''
  try {
    const response = await authApi.login(values)
    authStore.setToken(response.token)
    const redirect = (route.query.redirect as string) || '/dashboard'
    await router.push(redirect)
    toast.success('Bem-vindo de volta!')
  } catch (err: any) {
    loginError.value =
      err.response?.data?.message || 'Email ou senha inválidos'
    toast.error(loginError.value)
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
}

.login-brand {
  flex: 1;
  background: linear-gradient(135deg, var(--color-primary-700), var(--color-primary-500));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
}

.login-brand__content {
  max-width: 400px;
  color: white;
}

.login-brand__logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.login-brand__name {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
}

.login-brand__title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-4);
}

.login-brand__subtitle {
  font-size: var(--text-lg);
  opacity: 0.85;
  line-height: var(--leading-relaxed);
}

.login-form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  background-color: var(--color-bg-surface);
}

.login-form-container {
  width: 100%;
  max-width: 400px;
}

.login-form-header {
  margin-bottom: var(--space-8);
}

.login-form-header h2 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-2);
}

.login-form-header p {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
}

.login-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.field__label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-neutral-700);
  margin-bottom: var(--space-1);
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
  ring: 2px;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px rgba(37, 99, 171, 0.15);
}

.field__input--error {
  border-color: var(--color-danger-500);
}

.field__input--error:focus {
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
}

.field__password-wrap {
  position: relative;
}

.field__input--password {
  padding-right: var(--space-10);
}

.field__toggle-password {
  position: absolute;
  right: var(--space-2);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-neutral-400);
  padding: var(--space-1);
  display: flex;
  align-items: center;
}

.field__toggle-password:hover {
  color: var(--color-neutral-600);
}

.field__error {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-danger-600);
  margin-top: var(--space-1);
}

.login-error {
  background: var(--color-danger-50);
  color: var(--color-danger-700);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}

.login-submit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: white;
  background: var(--color-primary-500);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background var(--duration-fast);
}

.login-submit:hover:not(:disabled) {
  background: var(--color-primary-400);
}

.login-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-submit__spinner {
  animation: spin 1s linear infinite;
}

.login-footer {
  margin-top: var(--space-8);
  text-align: center;
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }
  .login-brand {
    padding: var(--space-8) var(--space-6);
    min-height: 200px;
  }
  .login-brand__title {
    font-size: var(--text-2xl);
  }
  .login-form-side {
    padding: var(--space-8) var(--space-6);
  }
}
</style>

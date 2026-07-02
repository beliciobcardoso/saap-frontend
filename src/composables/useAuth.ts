import { useMutation } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { getApiErrorMessage } from '@/api/client'
import type { LoginRequest } from '@/api/types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      authStore.setToken(data.token)
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/dashboard')
    },
    onError: (error) => {
      toast.error('Erro ao entrar', { description: getApiErrorMessage(error) })
    },
  })

  function logout() {
    authStore.logout()
    router.push('/login')
  }

  return {
    loginMutation,
    logout,
    isAuthenticated: authStore.isAuthenticated,
    userEmail: authStore.userEmail,
    userRole: authStore.userRole,
  }
}

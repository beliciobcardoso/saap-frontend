import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'
import type { UserRole } from '@/api/types'

interface JwtPayload {
  iss: string
  sub: string
  role: UserRole
  exp: number
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('saap_token'))
  const userEmail = ref<string | null>(null)
  const userRole = ref<UserRole | null>(null)

  // Initialize user info from token if valid
  if (token.value) {
    try {
      const decoded = jwtDecode<JwtPayload>(token.value)
      const now = Date.now() / 1000
      if (decoded.exp > now) {
        userEmail.value = decoded.sub
        userRole.value = decoded.role
      } else {
        // Token expired
        token.value = null
        userEmail.value = null
        userRole.value = null
        localStorage.removeItem('saap_token')
      }
    } catch {
      // Invalid token
      token.value = null
      userEmail.value = null
      userRole.value = null
      localStorage.removeItem('saap_token')
    }
  }

  const isAuthenticated = computed(() => {
    if (!token.value) return false
    try {
      const decoded = jwtDecode<JwtPayload>(token.value)
      const now = Date.now() / 1000
      return decoded.exp > now
    } catch {
      return false
    }
  })

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('saap_token', newToken)
    try {
      const decoded = jwtDecode<JwtPayload>(newToken)
      userEmail.value = decoded.sub
      userRole.value = decoded.role
    } catch {
      // If token is invalid, clear it
      token.value = null
      userEmail.value = null
      userRole.value = null
      localStorage.removeItem('saap_token')
    }
  }

  function logout() {
    token.value = null
    userEmail.value = null
    userRole.value = null
    localStorage.removeItem('saap_token')
  }

  return { token, userEmail, userRole, isAuthenticated, setToken, logout }
})
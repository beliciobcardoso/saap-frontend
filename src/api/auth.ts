import { apiClient } from './client'
import type { LoginRequest, AuthTokenResponse } from './types'

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthTokenResponse>('/auth/login', data).then(r => r.data),
}

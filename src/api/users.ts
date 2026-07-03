import { apiClient } from './client'
import type { UserResponse, UserRequest } from './types'

export const usersApi = {
  list: () =>
    apiClient.get<UserResponse[]>('/api/v1/users').then(r => r.data),
  get: (id: string) =>
    apiClient.get<UserResponse>(`/api/v1/users/${id}`).then(r => r.data),
  create: (data: UserRequest) =>
    apiClient.post<UserResponse>('/api/v1/users', data).then(r => r.data),
  update: (id: string, data: Partial<UserRequest>) =>
    apiClient.put<UserResponse>(`/api/v1/users/${id}`, data).then(r => r.data),
  deactivate: (id: string) =>
    apiClient.delete(`/api/v1/users/${id}`),
}

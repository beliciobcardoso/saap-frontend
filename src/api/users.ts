import { apiClient } from './client'
import type { UserResponse, UserRequest } from './types'

export const usersApi = {
  list: () =>
    apiClient.get<UserResponse[]>('/users').then(r => r.data),
  get: (id: string) =>
    apiClient.get<UserResponse>(`/users/${id}`).then(r => r.data),
  create: (data: UserRequest) =>
    apiClient.post<UserResponse>('/users', data).then(r => r.data),
  update: (id: string, data: Partial<UserRequest>) =>
    apiClient.put<UserResponse>(`/users/${id}`, data).then(r => r.data),
  deactivate: (id: string) =>
    apiClient.delete(`/users/${id}`),
}

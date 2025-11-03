import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, logout, register } from './auth.api'
import type { AuthSuccess, LoginRequest, LogoutSuccess, RegisterRequest } from './auth.types'
import { qk } from '../../query/keys'
import { AppError } from '../../core/error'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation<AuthSuccess, AppError, LoginRequest>({
    mutationFn: login,
    onSuccess: response => {
      queryClient.setQueryData(qk.auth.profile(), response.user)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation<LogoutSuccess, AppError, void>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: qk.auth.profile() })
      queryClient.removeQueries({ queryKey: qk.user.list() })
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation<AuthSuccess, AppError, RegisterRequest>({
    mutationFn: register,
    onSuccess: response => {
      queryClient.setQueryData(qk.auth.profile(), response.user)
    },
  })
}



import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  forgotPassword,
  login,
  logout,
  register,
  resendVerificationEmail,
  resetPassword,
} from './auth.api'
import type {
  AuthSuccess,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutSuccess,
  MessageOnlySuccess,
  RegisterRequest,
  RegisterSuccess,
  ResendVerificationRequest,
  ResetPasswordRequest,
} from './auth.types'
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
  return useMutation<RegisterSuccess, AppError, RegisterRequest>({
    mutationFn: register,
  })
}

export function useResendVerificationEmail() {
  return useMutation<MessageOnlySuccess, AppError, ResendVerificationRequest>({
    mutationFn: resendVerificationEmail,
  })
}

export function useForgotPassword() {
  return useMutation<MessageOnlySuccess, AppError, ForgotPasswordRequest>({
    mutationFn: forgotPassword,
  })
}

export function useResetPassword() {
  return useMutation<MessageOnlySuccess, AppError, ResetPasswordRequest>({
    mutationFn: resetPassword,
  })
}
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  register,
  resendVerificationEmail,
  resetPassword,
  updateProfile,
} from './auth.api'
import type {
  AuthenticatedUser,
  AuthSuccess,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutSuccess,
  MessageOnlySuccess,
  RegisterRequest,
  RegisterSuccess,
  ResendVerificationRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
} from './auth.types'
import { qk } from '../../query/keys'
import { AppError } from '../../core/error'

export function useLogin() {
  return useMutation<AuthSuccess, AppError, LoginRequest>({
    mutationFn: login,
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

export function useUpdateProfile() {
  return useMutation<AuthenticatedUser, AppError, UpdateProfileRequest>({
    mutationFn: updateProfile,
  })
}

export function useChangePassword() {
  return useMutation<MessageOnlySuccess, AppError, ChangePasswordRequest>({
    mutationFn: changePassword,
  })
}
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  changePassword,
  forgotPassword,
  getProfile,
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
import { setCachedUserRole } from '@/utils/roleGuard'

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation<AuthSuccess, AppError, LoginRequest>({
    mutationFn: login,
    onSuccess: async response => {
      queryClient.setQueryData(qk.auth.profile(), response.user)
      if (response.user?.role) {
        setCachedUserRole(response.user.role)
        return
      }

      try {
        const profile = await queryClient.fetchQuery({
          queryKey: qk.auth.profile(),
          queryFn: getProfile,
        })
        queryClient.setQueryData(qk.auth.profile(), profile)
        if (profile.role) {
          setCachedUserRole(profile.role)
        }
      } catch {
        // ignore profile fetch errors; role guard will sync later via useSetupUserRole
      }
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

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation<AuthenticatedUser, AppError, UpdateProfileRequest>({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(qk.auth.profile(), user)
    },
  })
}

export function useChangePassword() {
  return useMutation<MessageOnlySuccess, AppError, ChangePasswordRequest>({
    mutationFn: changePassword,
  })
}
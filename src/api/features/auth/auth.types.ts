import { z } from 'zod'
import {
  AuthSuccessSchema,
  AuthenticatedUserSchema,
  ForgotPasswordRequestSchema,
  LoginRequestSchema,
  LogoutSuccessSchema,
  MessageOnlySuccessSchema,
  RegisterRequestSchema,
  RegisterSuccessSchema,
  ResetPasswordRequestSchema,
  ResendVerificationRequestSchema,
  UpdateProfileRequestSchema,
  ChangePasswordRequestSchema,
} from './auth.schemas'

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type RegisterSuccess = z.infer<typeof RegisterSuccessSchema>
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>
export type AuthSuccess = z.infer<typeof AuthSuccessSchema>
export type LogoutSuccess = z.infer<typeof LogoutSuccessSchema>
export type ResendVerificationRequest = z.infer<typeof ResendVerificationRequestSchema>
export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>
export type MessageOnlySuccess = z.infer<typeof MessageOnlySuccessSchema>
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>
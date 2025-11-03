import { z } from 'zod'
import {
  AuthSuccessSchema,
  AuthenticatedUserSchema,
  LoginRequestSchema,
  LogoutSuccessSchema,
  RegisterRequestSchema,
} from './auth.schemas'

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>
export type AuthSuccess = z.infer<typeof AuthSuccessSchema>
export type LogoutSuccess = z.infer<typeof LogoutSuccessSchema>

import { get, post, put } from '../../core/fetcher'
import { clearTokens, setAccessToken } from '../../core/auth-key'
import { createApiResponseSchema, createNullableApiResponseSchema, parseWithZod } from '../../core/guards'
import { setCachedUserRole } from '@/utils/roleGuard'
import {
  AuthSuccessSchema,
  LoginRequestSchema,
  LogoutSuccessSchema,
  MessageOnlySuccessSchema,
  RegisterRequestSchema,
  RegisterSuccessSchema,
  ResetPasswordRequestSchema,
  ResendVerificationRequestSchema,
  ForgotPasswordRequestSchema,
  UpdateProfileRequestSchema,
  ChangePasswordRequestSchema,
  UserPayloadSchema,
} from './auth.schemas'
import type {
  AuthSuccess,
  AuthenticatedUser,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutSuccess,
  MessageOnlySuccess,
  RegisterRequest,
  RegisterSuccess,
  ResetPasswordRequest,
  ResendVerificationRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from './auth.types'

const authSuccessEnvelope = createApiResponseSchema(AuthSuccessSchema)
const registerSuccessEnvelope = createApiResponseSchema(RegisterSuccessSchema)
const profileEnvelope = createApiResponseSchema(UserPayloadSchema)
const logoutEnvelope = createApiResponseSchema(LogoutSuccessSchema)
const optionalLogoutEnvelope = createNullableApiResponseSchema(LogoutSuccessSchema)
const messageOnlyEnvelope = createApiResponseSchema(MessageOnlySuccessSchema)

function toRegisterPayload(payload: RegisterRequest) {
  return {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    password_confirmation: payload.passwordConfirmation,
  }
}

function toLoginPayload(payload: LoginRequest) {
  return {
    email: payload.email,
    password: payload.password,
    device_name: payload.deviceName,
  }
}

function handleAuthSuccess(data: AuthSuccess): AuthSuccess {
  setAccessToken(data.token)
  if (data.user?.role) {
    setCachedUserRole(data.user.role)
  }
  return data
}

export async function register(payload: RegisterRequest): Promise<RegisterSuccess> {
  const validPayload = parseWithZod(RegisterRequestSchema, payload)
  const response = await post<unknown, ReturnType<typeof toRegisterPayload>>('/api/register', toRegisterPayload(validPayload), {
    skipAuth: true,
  })
  const parsed = parseWithZod(registerSuccessEnvelope, response)
  return parsed.data
}

export async function login(payload: LoginRequest): Promise<AuthSuccess> {
  const validPayload = parseWithZod(LoginRequestSchema, payload)
  const response = await post<unknown, ReturnType<typeof toLoginPayload>>('/api/login', toLoginPayload(validPayload), {
    skipAuth: true,
  })
  // eslint-disable-next-line no-console
  console.log('[auth.api.login] raw response', response)
  const parsed = parseWithZod(authSuccessEnvelope, response)
  return handleAuthSuccess(parsed.data)
}

export async function getProfile(): Promise<AuthenticatedUser> {
  const response = await get<unknown>('/api/user')
  // Debug log to inspect raw API response shape
  // eslint-disable-next-line no-console
  console.log('[auth.api.getProfile] raw response', response)
  const parsed = parseWithZod(profileEnvelope, response)
  // eslint-disable-next-line no-console
  console.log('[auth.api.getProfile] parsed data', parsed)
  return parsed.data.user
}

export async function logout(): Promise<LogoutSuccess> {
  const response = await post<unknown, Record<string, never>>('/api/auth/logout', {})
  const parsed = parseWithZod(logoutEnvelope, response)
  clearTokens()
  return parsed.data
}

export async function logoutAll(): Promise<LogoutSuccess | null> {
  const response = await post<unknown, Record<string, never>>('/api/auth/logout-all', {})
  const parsed = parseWithZod(optionalLogoutEnvelope, response)
  return parsed.data ?? null
}

export async function resendVerificationEmail(
  payload: ResendVerificationRequest,
): Promise<MessageOnlySuccess> {
  const validPayload = parseWithZod(ResendVerificationRequestSchema, payload)
  const response = await post<unknown, ResendVerificationRequest>('/api/email/resend', validPayload, {
    skipAuth: true,
  })
  const parsed = parseWithZod(messageOnlyEnvelope, response)
  return parsed.data
}

export async function forgotPassword(payload: ForgotPasswordRequest): Promise<MessageOnlySuccess> {
  const validPayload = parseWithZod(ForgotPasswordRequestSchema, payload)
  const response = await post<unknown, ForgotPasswordRequest>('/api/forgot-password', validPayload, {
    skipAuth: true,
  })
  const parsed = parseWithZod(messageOnlyEnvelope, response)
  return parsed.data
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<MessageOnlySuccess> {
  const validPayload = parseWithZod(ResetPasswordRequestSchema, payload)
  const requestBody = {
    email: validPayload.email,
    token: validPayload.token,
    password: validPayload.password,
    password_confirmation: validPayload.passwordConfirmation,
  }
  const response = await post<unknown, typeof requestBody>('/api/reset-password', requestBody, {
    skipAuth: true,
  })
  const parsed = parseWithZod(messageOnlyEnvelope, response)
  return parsed.data
}

export async function updateProfile(payload: UpdateProfileRequest): Promise<AuthenticatedUser> {
  const validPayload = parseWithZod(UpdateProfileRequestSchema, payload)
  const response = await put<unknown, UpdateProfileRequest>('/api/user/profile', validPayload)
  const parsed = parseWithZod(profileEnvelope, response)
  return parsed.data.user
}

export async function changePassword(payload: ChangePasswordRequest): Promise<MessageOnlySuccess> {
  const validPayload = parseWithZod(ChangePasswordRequestSchema, payload)
  const requestBody = {
    current_password: validPayload.currentPassword,
    new_password: validPayload.password,
    new_password_confirmation: validPayload.passwordConfirmation,
  }
  const response = await put<unknown, typeof requestBody>('/api/user/password', requestBody)
  const parsed = parseWithZod(messageOnlyEnvelope, response)
  return parsed.data
}

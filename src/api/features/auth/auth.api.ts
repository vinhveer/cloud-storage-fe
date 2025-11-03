import { get, post } from '../../core/fetcher'
import { clearTokens, setAccessToken } from '../../core/auth-key'
import { createApiResponseSchema, createNullableApiResponseSchema, parseWithZod } from '../../core/guards'
import {
  AuthSuccessSchema,
  LoginRequestSchema,
  LogoutSuccessSchema,
  RegisterRequestSchema,
  UserPayloadSchema,
} from './auth.schemas'
import type { AuthSuccess, AuthenticatedUser, LoginRequest, LogoutSuccess, RegisterRequest } from './auth.types'

const authSuccessEnvelope = createApiResponseSchema(AuthSuccessSchema)
const userEnvelope = createApiResponseSchema(UserPayloadSchema)
const logoutEnvelope = createApiResponseSchema(LogoutSuccessSchema)
const optionalLogoutEnvelope = createNullableApiResponseSchema(LogoutSuccessSchema)

function toRegisterPayload(payload: RegisterRequest) {
  return {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    password_confirmation: payload.passwordConfirmation,
    device_name: payload.deviceName,
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
  return data
}

export async function register(payload: RegisterRequest): Promise<AuthSuccess> {
  const validPayload = parseWithZod(RegisterRequestSchema, payload)
  const response = await post<unknown, ReturnType<typeof toRegisterPayload>>('/api/auth/register', toRegisterPayload(validPayload))
  const parsed = parseWithZod(authSuccessEnvelope, response)
  return handleAuthSuccess(parsed.data)
}

export async function login(payload: LoginRequest): Promise<AuthSuccess> {
  const validPayload = parseWithZod(LoginRequestSchema, payload)
  const response = await post<unknown, ReturnType<typeof toLoginPayload>>('/api/auth/login', toLoginPayload(validPayload), {
    skipAuth: true,
  })
  const parsed = parseWithZod(authSuccessEnvelope, response)
  return handleAuthSuccess(parsed.data)
}

export async function getProfile(): Promise<AuthenticatedUser> {
  const response = await get<unknown>('/api/auth/me')
  const parsed = parseWithZod(userEnvelope, response)
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

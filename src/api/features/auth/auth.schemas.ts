import { z } from 'zod'

export const RegisterRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  passwordConfirmation: z.string().min(8),
  deviceName: z.string().min(1),
}).refine(values => values.password === values.passwordConfirmation, {
  message: 'Password confirmation must match password',
  path: ['passwordConfirmation'],
})

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  deviceName: z.string().min(1),
})

export const AuthenticatedUserSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
})

export const AuthSuccessSchema = z.object({
  message: z.string().min(1),
  token: z.string().min(1),
  user: AuthenticatedUserSchema,
})

export const UserPayloadSchema = z.object({
  user: AuthenticatedUserSchema,
})

export const LogoutSuccessSchema = z.object({
  message: z.string().min(1),
})

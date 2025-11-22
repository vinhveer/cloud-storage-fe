import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .min(1)
  .refine(value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
    message: 'Invalid email address',
  })

export const RegisterRequestSchema = z
  .object({
    name: z.string().min(1),
    email: emailSchema,
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
    deviceName: z.string().min(1).optional(),
  })
  .refine(values => values.password === values.passwordConfirmation, {
    message: 'Password confirmation must match password',
    path: ['passwordConfirmation'],
  })

export const LoginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
  deviceName: z.string().min(1).optional(),
})

export const AuthenticatedUserSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  email: emailSchema,
})

export const UserPayloadSchema = z.object({
  user: AuthenticatedUserSchema,
})

export const RegisterSuccessSchema = z.object({
  message: z.string().min(1),
  user: AuthenticatedUserSchema,
})

export const AuthSuccessSchema = z.object({
  message: z.string().min(1),
  token: z.string().min(1),
  user: AuthenticatedUserSchema,
})

export const ResendVerificationRequestSchema = z.object({
  email: emailSchema,
})

export const MessageOnlySuccessSchema = z.object({
  message: z.string().min(1),
})

export const ForgotPasswordRequestSchema = z.object({
  email: emailSchema,
})

export const ResetPasswordRequestSchema = z
  .object({
    email: emailSchema,
    token: z.string().min(1),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine(values => values.password === values.passwordConfirmation, {
    message: 'Password confirmation must match password',
    path: ['passwordConfirmation'],
  })

export const LogoutSuccessSchema = z.object({
  message: z.string().min(1),
})

export const UpdateProfileRequestSchema = z.object({
  name: z.string().min(1),
  email: emailSchema,
})

export const ChangePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
  })
  .refine(values => values.password === values.passwordConfirmation, {
    message: 'Password confirmation must match password',
    path: ['passwordConfirmation'],
  })

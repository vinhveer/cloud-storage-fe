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

const RawAuthenticatedUserSchema = z.object({
  user_id: z.number().optional(),
  id: z.number().optional(),
  name: z.string().min(1),
  email: emailSchema,
  role: z.enum(['admin', 'user', 'viewer']).default('user'),
  storage_used: z.number().optional(),
  storage_limit: z.number().optional(),
  email_verified_at: z.string().optional(),
})

export const AuthenticatedUserSchema = RawAuthenticatedUserSchema.superRefine((data, ctx) => {
  if (typeof data.user_id !== 'number' && typeof data.id !== 'number') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'user_id or id is required',
      path: ['user_id'],
    })
  }
}).transform((data) => ({
  user_id: data.user_id ?? (data.id as number),
  name: data.name,
  email: data.email,
  role: data.role,
  storage_used: data.storage_used,
  storage_limit: data.storage_limit,
  email_verified_at: data.email_verified_at,
}))

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

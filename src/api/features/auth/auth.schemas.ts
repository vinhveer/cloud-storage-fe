import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .min(1)
  .refine(value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
    message: 'Invalid email address',
  })

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name cannot be empty')
  .max(100, 'Name must not exceed 100 characters')
  .refine(value => !/^\d+$/.test(value), {
    message: 'Name cannot contain only numbers',
  })
  .refine(value => /^[a-zA-ZÀ-ỹ0-9\s'-]+$/.test(value), {
    message: 'Name can only contain letters, numbers, spaces, hyphens, and apostrophes',
  })
  .refine(value => /[a-zA-ZÀ-ỹ]/.test(value), {
    message: 'Name must contain at least one letter',
  })

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .refine(value => /[a-zA-Z]/.test(value), {
    message: 'Password must contain at least one letter',
  })
  .refine(value => /\d/.test(value), {
    message: 'Password must contain at least one number',
  })
  .refine(value => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value), {
    message: 'Password must contain at least one special character',
  })

export const RegisterRequestSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
    deviceName: z.string().min(1).optional(),
  })
  .refine(values => values.password === values.passwordConfirmation, {
    message: 'Password confirmation must match password',
    path: ['passwordConfirmation'],
  })

export const LoginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  deviceName: z.string().min(1).optional(),
})

const RawAuthenticatedUserSchema = z.object({
  user_id: z.number().optional(),
  id: z.number().optional(),
  name: nameSchema,
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
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
  })
  .refine(values => values.password === values.passwordConfirmation, {
    message: 'Password confirmation must match password',
    path: ['passwordConfirmation'],
  })

export const LogoutSuccessSchema = z.object({
  message: z.string().min(1),
})

export const UpdateProfileRequestSchema = z.object({
  name: nameSchema,
  email: emailSchema,
})

export const ChangePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1),
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
  })
  .refine(values => values.password === values.passwordConfirmation, {
    message: 'Password confirmation must match password',
    path: ['passwordConfirmation'],
  })

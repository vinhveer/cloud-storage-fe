import { z } from 'zod'
import { createApiResponseSchema } from '../../core/guards'

// Admin users list
export const AdminUserItemSchema = z.object({
    user_id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
    storage_limit: z.number(),
    storage_used: z.number(),
})

export const AdminUsersPaginationSchema = z.object({
    current_page: z.number(),
    total_pages: z.number(),
    total_items: z.number(),
})

export const AdminUsersSuccessSchema = z.object({
    data: z.array(AdminUserItemSchema),
    pagination: AdminUsersPaginationSchema,
})

export const AdminUsersEnvelopeSchema = createApiResponseSchema(AdminUsersSuccessSchema)

export const AdminUsersResponseSchema = z.union([AdminUsersEnvelopeSchema, AdminUsersSuccessSchema])

// Admin user create
export const AdminUserCreateRequestSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['user', 'admin']),
})

export const AdminUserCreateSuccessSchema = z.object({
    success: z.boolean().optional(),
    user: AdminUserItemSchema,
})

export const AdminUserCreateEnvelopeSchema = createApiResponseSchema(AdminUserCreateSuccessSchema)

export const AdminUserCreateResponseSchema = z.union([
    AdminUserCreateSuccessSchema,
    AdminUserCreateEnvelopeSchema,
])

// Admin user update
export const AdminUserUpdateRequestSchema = z.object({
    name: z.string().min(1).optional(),
    storage_limit: z.number().int().nonnegative().optional(),
})

export const AdminUserUpdateSuccessSchema = z.object({
    success: z.boolean().optional(),
    user: AdminUserItemSchema,
})

export const AdminUserUpdateEnvelopeSchema = createApiResponseSchema(AdminUserUpdateSuccessSchema)

export const AdminUserUpdateResponseSchema = z.union([
    AdminUserUpdateSuccessSchema,
    AdminUserUpdateEnvelopeSchema,
])

// Admin user delete
export const AdminUserDeleteRawSuccessSchema = z.object({
    success: z.literal(true),
    message: z.string().min(1),
})

export const AdminUserDeleteEnvelopeSuccessSchema = createApiResponseSchema(AdminUserDeleteRawSuccessSchema)

export const AdminUserDeleteResponseSchema = z.union([
    AdminUserDeleteEnvelopeSuccessSchema,
    AdminUserDeleteRawSuccessSchema,
])

export const AdminUserDeleteSuccessSchema = AdminUserDeleteRawSuccessSchema

// Admin user detail
export const AdminUserWrapperSchema = z.object({
    user: AdminUserItemSchema,
})

export const AdminUserEnvelopeSchema = createApiResponseSchema(AdminUserWrapperSchema)

export const AdminUserDetailResponseSchema = z.union([
    AdminUserWrapperSchema,
    AdminUserEnvelopeSchema,
])

// Admin user role update
export const AdminUserRoleUpdateRequestSchema = z.object({
    role: z.enum(['user', 'admin']),
})

export const UpdatedUserRoleSchema = z.object({
    user_id: z.number(),
    role: z.enum(['user', 'admin']),
})

export const AdminUserRoleUpdateSuccessSchema = z.object({
    success: z.boolean().optional(),
    message: z.string().min(1).optional(),
    user: UpdatedUserRoleSchema.optional(),
})

export const AdminUserRoleUpdateEnvelopeSchema = createApiResponseSchema(AdminUserRoleUpdateSuccessSchema)

export const AdminUserRoleUpdateResponseSchema = z.union([
    AdminUserRoleUpdateSuccessSchema,
    AdminUserRoleUpdateEnvelopeSchema,
])

// Admin user storage usage
export const AdminUserStorageUsageSchema = z.object({
    user_id: z.number(),
    storage_used: z.number(),
    storage_limit: z.number(),
    usage_percent: z.number(),
})

export const AdminUserStorageUsageEnvelopeSchema = createApiResponseSchema(AdminUserStorageUsageSchema)

export const AdminUserStorageUsageResponseSchema = z.union([
    AdminUserStorageUsageSchema,
    AdminUserStorageUsageEnvelopeSchema,
])

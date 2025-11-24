import { get, post, put, deleteRequest } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { z } from 'zod'
import { AppError } from '../../core/error'
import {
    AdminUsersResponseSchema,
    AdminUserCreateRequestSchema,
    AdminUserCreateResponseSchema,
    AdminUserUpdateRequestSchema,
    AdminUserUpdateResponseSchema,
    AdminUserDeleteResponseSchema,
    AdminUserDeleteSuccessSchema,
    AdminUserDetailResponseSchema,
    AdminUserRoleUpdateRequestSchema,
    AdminUserRoleUpdateResponseSchema,
    AdminUserStorageUsageResponseSchema,
} from './users.schemas'
import type {
    AdminUsersListParams,
    AdminUsersResponse,
    AdminUsersSuccess,
    AdminUserCreateRequest,
    AdminUserCreateResponse,
    AdminUserItem,
    AdminUserUpdateRequest,
    AdminUserUpdateResponse,
    AdminUserDeleteResponse,
    AdminUserDeleteSuccess,
    AdminUser,
    AdminUserDetailResponse,
    AdminUserRoleUpdateRequest,
    AdminUserRoleUpdateResponse,
    UpdatedUserRole,
    AdminUserStorageUsage,
    AdminUserStorageUsageResponse,
} from './users.types'

export async function getAdminUsers(params: AdminUsersListParams = {}): Promise<AdminUsersSuccess> {
    const response = await get<unknown>('/api/admin/users', {
        params: {
            search: params.search,
            page: params.page,
            per_page: params.per_page,
        },
    })
    const parsed = AdminUsersResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: AdminUsersResponse = parsed.data as z.infer<typeof AdminUsersResponseSchema>
    if ('success' in value && 'data' in value) {
        return value.data
    }
    return value as AdminUsersSuccess
}

export async function createAdminUser(payload: AdminUserCreateRequest): Promise<AdminUserItem> {
    const valid = AdminUserCreateRequestSchema.parse(payload)
    const response = await post<unknown, AdminUserCreateRequest>('/api/admin/users', valid)
    const parsed = AdminUserCreateResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: AdminUserCreateResponse = parsed.data as z.infer<typeof AdminUserCreateResponseSchema>
    if ('success' in value && 'data' in value) {
        return value.data.user
    }
    return value.user
}

export async function updateAdminUser(userId: number, payload: AdminUserUpdateRequest): Promise<AdminUserItem> {
    const valid = AdminUserUpdateRequestSchema.parse(payload)
    const response = await put<unknown, AdminUserUpdateRequest>(`/api/admin/users/${userId}`, valid)
    const parsed = AdminUserUpdateResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: AdminUserUpdateResponse = parsed.data as z.infer<typeof AdminUserUpdateResponseSchema>
    if ('success' in value && 'data' in value) {
        return value.data.user
    }
    return value.user
}

const deleteResponseSchema = AdminUserDeleteResponseSchema

export async function deleteAdminUser(userId: number): Promise<AdminUserDeleteSuccess> {
    const response = await deleteRequest<unknown>(`/api/admin/users/${userId}`)
    const parsed = parseWithZod<AdminUserDeleteResponse>(deleteResponseSchema, response)

    if (parsed && typeof parsed === 'object' && 'data' in parsed) {
        const dataObj = (parsed as { data: unknown }).data
        return parseWithZod(AdminUserDeleteSuccessSchema, dataObj)
    }

    return parseWithZod(AdminUserDeleteSuccessSchema, parsed)
}

export async function getAdminUserById(userId: number): Promise<AdminUser> {
    const response = await get<unknown>(`/api/admin/users/${userId}`)
    const parsed = AdminUserDetailResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: AdminUserDetailResponse = parsed.data as z.infer<typeof AdminUserDetailResponseSchema>
    if ('success' in value && 'data' in value) {
        return value.data.user
    }
    return value.user
}

export async function updateAdminUserRole(
    userId: number,
    payload: AdminUserRoleUpdateRequest,
): Promise<UpdatedUserRole> {
    const valid = AdminUserRoleUpdateRequestSchema.parse(payload)
    const response = await put<unknown, AdminUserRoleUpdateRequest>(`/api/admin/users/${userId}/role`, valid)
    const parsed = AdminUserRoleUpdateResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: AdminUserRoleUpdateResponse = parsed.data as z.infer<typeof AdminUserRoleUpdateResponseSchema>
    if ('success' in value && 'data' in value) {
        if (!value.data.user) {
            throw new AppError('Missing user in response', { code: 'INVALID_RESPONSE' })
        }
        return value.data.user
    }
    if (!value.user) {
        throw new AppError('Missing user in response', { code: 'INVALID_RESPONSE' })
    }
    return value.user
}

export async function getAdminUserStorageUsage(userId: number): Promise<AdminUserStorageUsage> {
    const response = await get<unknown>(`/api/admin/users/${userId}/storage-usage`)
    const parsed = AdminUserStorageUsageResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: AdminUserStorageUsageResponse = parsed.data as z.infer<typeof AdminUserStorageUsageResponseSchema>
    if ('success' in value && 'data' in value) {
        return value.data
    }
    return value
}

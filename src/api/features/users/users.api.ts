import { get, post, put, deleteRequest } from '../../core/fetcher'
import { parseWithZod } from '../../core/guards'
import { z } from 'zod'
import { AppError } from '../../core/error'
import {
    UsersResponseSchema,
    UserCreateRequestSchema,
    UserCreateResponseSchema,
    UserUpdateRequestSchema,
    UserUpdateResponseSchema,
    UserDeleteResponseSchema,
    UserDeleteSuccessSchema,
    UserDetailResponseSchema,
    UserRoleUpdateRequestSchema,
    UserRoleUpdateResponseSchema,
    UserStorageUsageResponseSchema,
} from './users.schemas'
import type {
    UsersListParams,
    UsersResponse,
    UsersSuccess,
    UserCreateRequest,
    UserCreateResponse,
    UserItem,
    UserUpdateRequest,
    UserUpdateResponse,
    UserDeleteResponse,
    UserDeleteSuccess,
    User,
    UserDetailResponse,
    UserRoleUpdateRequest,
    UserRoleUpdateResponse,
    UpdatedUserRole,
    UserStorageUsage,
    UserStorageUsageResponse,
} from './users.types'

export async function getUsers(params: UsersListParams = {}): Promise<UsersSuccess> {
    const response = await get<unknown>('/api/admin/users', {
        params: {
            search: params.search,
            page: params.page,
            per_page: params.per_page,
        },
    })
    const parsed = UsersResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: UsersResponse = parsed.data as z.infer<typeof UsersResponseSchema>
    if ('success' in value && 'data' in value) {
        return value.data
    }
    return value as UsersSuccess
}

export async function createUser(payload: UserCreateRequest): Promise<UserItem> {
    const valid = UserCreateRequestSchema.parse(payload)
    const response = await post<unknown, UserCreateRequest>('/api/admin/users', valid)
    const parsed = UserCreateResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: UserCreateResponse = parsed.data as z.infer<typeof UserCreateResponseSchema>
    if ('success' in value && 'data' in value) {
        return value.data.user
    }
    return value.user
}

export async function updateUser(userId: number, payload: UserUpdateRequest): Promise<UserItem> {
    const valid = UserUpdateRequestSchema.parse(payload)
    const response = await put<unknown, UserUpdateRequest>(`/api/admin/users/${userId}`, valid)
    const parsed = UserUpdateResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: UserUpdateResponse = parsed.data as z.infer<typeof UserUpdateResponseSchema>
    if ('success' in value && 'data' in value) {
        return value.data.user
    }
    return value.user
}

const deleteResponseSchema = UserDeleteResponseSchema

export async function deleteUser(userId: number): Promise<UserDeleteSuccess> {
    const response = await deleteRequest<unknown>(`/api/admin/users/${userId}`)
    const parsed = parseWithZod<UserDeleteResponse>(deleteResponseSchema, response)

    if (parsed && typeof parsed === 'object' && 'data' in parsed) {
        const dataObj = (parsed as { data: unknown }).data
        return parseWithZod(UserDeleteSuccessSchema, dataObj)
    }

    return parseWithZod(UserDeleteSuccessSchema, parsed)
}

export async function getUserById(userId: number): Promise<User> {
    const response = await get<unknown>(`/api/admin/users/${userId}`)
    const parsed = UserDetailResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: UserDetailResponse = parsed.data as z.infer<typeof UserDetailResponseSchema>
    if ('success' in value && 'data' in value) {
        return value.data.user
    }
    return value.user
}

export async function updateUserRole(
    userId: number,
    payload: UserRoleUpdateRequest,
): Promise<UpdatedUserRole> {
    const valid = UserRoleUpdateRequestSchema.parse(payload)
    const response = await put<unknown, UserRoleUpdateRequest>(`/api/admin/users/${userId}/role`, valid)
    const parsed = UserRoleUpdateResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: UserRoleUpdateResponse = parsed.data as z.infer<typeof UserRoleUpdateResponseSchema>
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

export async function getUserStorageUsage(userId: number): Promise<UserStorageUsage> {
    const response = await get<unknown>(`/api/admin/users/${userId}/storage-usage`)
    const parsed = UserStorageUsageResponseSchema.safeParse(response)
    if (!parsed.success) {
        throw new AppError('Invalid response format', { code: 'INVALID_RESPONSE', details: parsed.error.issues })
    }
    const value: UserStorageUsageResponse = parsed.data as z.infer<typeof UserStorageUsageResponseSchema>
    if ('success' in value && 'data' in value) {
        return value.data
    }
    return value
}

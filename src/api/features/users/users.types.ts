import { z } from 'zod'
import {
    AdminUserItemSchema,
    AdminUsersEnvelopeSchema,
    AdminUsersPaginationSchema,
    AdminUsersResponseSchema,
    AdminUsersSuccessSchema,
    AdminUserCreateEnvelopeSchema,
    AdminUserCreateRequestSchema,
    AdminUserCreateResponseSchema,
    AdminUserCreateSuccessSchema,
    AdminUserUpdateEnvelopeSchema,
    AdminUserUpdateRequestSchema,
    AdminUserUpdateResponseSchema,
    AdminUserUpdateSuccessSchema,
    AdminUserDeleteResponseSchema,
    AdminUserDeleteSuccessSchema,
    AdminUserDetailResponseSchema,
    AdminUserEnvelopeSchema,
    AdminUserWrapperSchema,
    AdminUserRoleUpdateEnvelopeSchema,
    AdminUserRoleUpdateRequestSchema,
    AdminUserRoleUpdateResponseSchema,
    AdminUserRoleUpdateSuccessSchema,
    UpdatedUserRoleSchema,
    AdminUserStorageUsageEnvelopeSchema,
    AdminUserStorageUsageResponseSchema,
    AdminUserStorageUsageSchema,
} from './users.schemas'

// Admin users list
export type AdminUserItem = z.infer<typeof AdminUserItemSchema>
export type AdminUsersPagination = z.infer<typeof AdminUsersPaginationSchema>
export type AdminUsersSuccess = z.infer<typeof AdminUsersSuccessSchema>
export type AdminUsersEnvelope = z.infer<typeof AdminUsersEnvelopeSchema>
export type AdminUsersResponse = z.infer<typeof AdminUsersResponseSchema>

export type AdminUsersListParams = {
    search?: string
    page?: number
    per_page?: number
}

// Admin user create
export type AdminUserCreateRequest = z.infer<typeof AdminUserCreateRequestSchema>
export type AdminUserCreateSuccess = z.infer<typeof AdminUserCreateSuccessSchema>
export type AdminUserCreateEnvelope = z.infer<typeof AdminUserCreateEnvelopeSchema>
export type AdminUserCreateResponse = z.infer<typeof AdminUserCreateResponseSchema>

// Reuse AdminUserItem for create/update responses
// (AdminUserItem already defined above)

// Admin user update
export type AdminUserUpdateRequest = z.infer<typeof AdminUserUpdateRequestSchema>
export type AdminUserUpdateSuccess = z.infer<typeof AdminUserUpdateSuccessSchema>
export type AdminUserUpdateEnvelope = z.infer<typeof AdminUserUpdateEnvelopeSchema>
export type AdminUserUpdateResponse = z.infer<typeof AdminUserUpdateResponseSchema>

// Admin user delete
export type AdminUserDeleteSuccess = z.infer<typeof AdminUserDeleteSuccessSchema>
export type AdminUserDeleteResponse = z.infer<typeof AdminUserDeleteResponseSchema>

// Admin user detail
export type AdminUser = z.infer<typeof AdminUserItemSchema>
export type AdminUserWrapper = z.infer<typeof AdminUserWrapperSchema>
export type AdminUserEnvelope = z.infer<typeof AdminUserEnvelopeSchema>
export type AdminUserDetailResponse = z.infer<typeof AdminUserDetailResponseSchema>

// Admin user role update
export type AdminUserRoleUpdateRequest = z.infer<typeof AdminUserRoleUpdateRequestSchema>
export type UpdatedUserRole = z.infer<typeof UpdatedUserRoleSchema>
export type AdminUserRoleUpdateSuccess = z.infer<typeof AdminUserRoleUpdateSuccessSchema>
export type AdminUserRoleUpdateEnvelope = z.infer<typeof AdminUserRoleUpdateEnvelopeSchema>
export type AdminUserRoleUpdateResponse = z.infer<typeof AdminUserRoleUpdateResponseSchema>

// Admin user storage usage
export type AdminUserStorageUsage = z.infer<typeof AdminUserStorageUsageSchema>
export type AdminUserStorageUsageEnvelope = z.infer<typeof AdminUserStorageUsageEnvelopeSchema>
export type AdminUserStorageUsageResponse = z.infer<typeof AdminUserStorageUsageResponseSchema>

// User-friendly aliases (avoid Admin* naming in app code)
export type UserItem = AdminUserItem
export type UsersPagination = AdminUsersPagination
export type UsersSuccess = AdminUsersSuccess
export type UsersEnvelope = AdminUsersEnvelope
export type UsersResponse = AdminUsersResponse
export type UsersListParams = AdminUsersListParams

export type UserCreateRequest = AdminUserCreateRequest
export type UserCreateSuccess = AdminUserCreateSuccess
export type UserCreateEnvelope = AdminUserCreateEnvelope
export type UserCreateResponse = AdminUserCreateResponse

export type UserUpdateRequest = AdminUserUpdateRequest
export type UserUpdateSuccess = AdminUserUpdateSuccess
export type UserUpdateEnvelope = AdminUserUpdateEnvelope
export type UserUpdateResponse = AdminUserUpdateResponse

export type UserDeleteSuccess = AdminUserDeleteSuccess
export type UserDeleteResponse = AdminUserDeleteResponse

export type User = AdminUser
export type UserWrapper = AdminUserWrapper
export type UserEnvelope = AdminUserEnvelope
export type UserDetailResponse = AdminUserDetailResponse

export type UserRoleUpdateRequest = AdminUserRoleUpdateRequest
export type UserRoleUpdateSuccess = AdminUserRoleUpdateSuccess
export type UserRoleUpdateEnvelope = AdminUserRoleUpdateEnvelope
export type UserRoleUpdateResponse = AdminUserRoleUpdateResponse

export type UserStorageUsage = AdminUserStorageUsage
export type UserStorageUsageEnvelope = AdminUserStorageUsageEnvelope
export type UserStorageUsageResponse = AdminUserStorageUsageResponse

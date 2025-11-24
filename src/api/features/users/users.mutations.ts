import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    updateAdminUserRole,
} from './users.api'
import type {
    AdminUserCreateRequest,
    AdminUserItem,
    AdminUserItem as AdminUserItemUpdate,
    AdminUserUpdateRequest,
    AdminUserDeleteSuccess,
    AdminUserRoleUpdateRequest,
    UpdatedUserRole,
} from './users.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'

export function useCreateAdminUser() {
    return useMutation<AdminUserItem, AppError, AdminUserCreateRequest>({
        mutationFn: payload => createAdminUser(payload),
    })
}

export type UpdateAdminUserVariables = {
    userId: number
    name?: string
    storage_limit?: number
}

export function useUpdateAdminUser() {
    return useMutation<AdminUserItemUpdate, AppError, UpdateAdminUserVariables>({
        mutationFn: variables =>
            updateAdminUser(variables.userId, {
                name: variables.name,
                storage_limit: variables.storage_limit,
            } as AdminUserUpdateRequest),
    })
}

export function useDeleteAdminUser() {
    const queryClient = useQueryClient()
    return useMutation<AdminUserDeleteSuccess, AppError, number>({
        mutationFn: userId => deleteAdminUser(userId),
        onSuccess: (_data, userId) => {
            queryClient.removeQueries({ queryKey: qk.admin.userById(String(userId)) })
            // optionally refetch the users list
            // queryClient.invalidateQueries({ queryKey: qk.admin.users() })
        },
    })
}

export type UpdateAdminUserRoleVariables = {
    userId: number
    role: 'user' | 'admin'
}

export function useUpdateAdminUserRole() {
    return useMutation<UpdatedUserRole, AppError, UpdateAdminUserRoleVariables>({
        mutationFn: variables =>
            updateAdminUserRole(variables.userId, { role: variables.role } as AdminUserRoleUpdateRequest),
    })
}

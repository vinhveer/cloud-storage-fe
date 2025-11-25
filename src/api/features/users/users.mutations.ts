import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createUser,
    updateUser,
    deleteUser,
    updateUserRole,
} from './users.api'
import type {
    UserCreateRequest,
    UserItem,
    UserItem as UserItemUpdate,
    UserUpdateRequest,
    UserDeleteSuccess,
    UserRoleUpdateRequest,
    UpdatedUserRole,
} from './users.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'

export function useCreateUser() {
    return useMutation<UserItem, AppError, UserCreateRequest>({
        mutationFn: payload => createUser(payload),
    })
}

export type UpdateUserVariables = {
    userId: number
    name?: string
    storage_limit?: number
}

export function useUpdateUser() {
    return useMutation<UserItemUpdate, AppError, UpdateUserVariables>({
        mutationFn: variables =>
            updateUser(variables.userId, {
                name: variables.name,
                storage_limit: variables.storage_limit,
            } as UserUpdateRequest),
    })
}

export function useDeleteUser() {
    const queryClient = useQueryClient()
    return useMutation<UserDeleteSuccess, AppError, number>({
        mutationFn: userId => deleteUser(userId),
        onSuccess: (_data, userId) => {
            queryClient.removeQueries({ queryKey: qk.admin.userById(String(userId)) })
            // optionally refetch the users list
            // queryClient.invalidateQueries({ queryKey: qk.admin.users() })
        },
    })
}

export type UpdateUserRoleVariables = {
    userId: number
    role: 'user' | 'admin'
}

export function useUpdateUserRole() {
    return useMutation<UpdatedUserRole, AppError, UpdateUserRoleVariables>({
        mutationFn: variables =>
            updateUserRole(variables.userId, { role: variables.role } as UserRoleUpdateRequest),
    })
}

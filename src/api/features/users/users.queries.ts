import { useQuery } from '@tanstack/react-query'
import {
    getAdminUsers,
    getAdminUserById,
    getAdminUserStorageUsage,
} from './users.api'
import type {
    AdminUsersListParams,
    AdminUsersSuccess,
    AdminUser,
    AdminUserStorageUsage,
} from './users.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'
import type { ListParams } from '../../core/types'

export function useAdminUsers(params: AdminUsersListParams = {}) {
    const listParams: ListParams = {
        page: params.page,
        limit: params.per_page,
        search: params.search,
    }

    return useQuery<AdminUsersSuccess, AppError>({
        queryKey: qk.admin.users(listParams),
        queryFn: () => getAdminUsers(params),
    })
}

export function useAdminUserDetail(userId: number | undefined) {
    return useQuery<AdminUser, AppError>({
        queryKey: qk.admin.userById(String(userId)),
        queryFn: () => {
            if (userId === undefined) {
                throw new Error('userId is required')
            }
            return getAdminUserById(userId)
        },
        enabled: userId !== undefined,
    })
}

export function useAdminUserStorageUsage(userId: number | undefined) {
    return useQuery<AdminUserStorageUsage, AppError>({
        queryKey: qk.admin.userStorageUsage(String(userId)),
        queryFn: () => {
            if (userId === undefined) {
                throw new Error('userId is required')
            }
            return getAdminUserStorageUsage(userId)
        },
        enabled: userId !== undefined,
    })
}

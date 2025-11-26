import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import {
    getUsers,
    getUserById,
    getUserStorageUsage,
} from './users.api'
import type {
    UsersListParams,
    UsersSuccess,
    User,
    UserStorageUsage,
    UsersPagination,
} from './users.types'
import type { AppError } from '../../core/error'
import { qk } from '../../query/keys'
import type { ListParams } from '../../core/types'

export function useUsers(params: UsersListParams = {}) {
    const listParams: ListParams = {
        page: params.page,
        limit: params.per_page,
        search: params.search,
    }

    return useQuery<UsersSuccess, AppError>({
        queryKey: qk.admin.users(listParams),
        queryFn: () => getUsers(params),
    })
}

export function useInfiniteUsers(
    params: Omit<UsersListParams, 'page' | 'per_page'> = {},
    pageSize = 10,
) {
    return useInfiniteQuery<UsersSuccess, AppError>({
        queryKey: ['admin-users-infinite', params, pageSize],
        initialPageParam: 1,
        queryFn: ({ pageParam = 1 }) =>
            getUsers({
                ...params,
                page: pageParam as number,
                per_page: pageSize,
            }),
        getNextPageParam: (lastPage: UsersSuccess) => {
            const pagination = lastPage.pagination as UsersPagination
            if (!pagination) return undefined
            const { current_page, total_pages } = pagination
            return current_page < total_pages ? current_page + 1 : undefined
        },
    })
}

export function useUserDetail(userId: number | undefined) {
    return useQuery<User, AppError>({
        queryKey: qk.admin.userById(String(userId)),
        queryFn: () => {
            if (userId === undefined) {
                throw new Error('userId is required')
            }
            return getUserById(userId)
        },
        enabled: userId !== undefined,
    })
}

export function useUserStorageUsage(userId: number | undefined) {
    return useQuery<UserStorageUsage, AppError>({
        queryKey: qk.admin.userStorageUsage(String(userId)),
        queryFn: () => {
            if (userId === undefined) {
                throw new Error('userId is required')
            }
            return getUserStorageUsage(userId)
        },
        enabled: userId !== undefined,
    })
}

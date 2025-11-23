import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/api/features/auth/auth.api'
import { setCachedUserRole } from '@/utils/roleGuard'
import { qk } from '@/api/query/keys'

/**
 * Hook: Sync user role từ API vào roleGuard cache
 * Dùng ở root provider để set role cho sidebar filter
 */
export function useSetupUserRole() {
    const { data: user, error, isLoading } = useQuery({
        queryKey: qk.auth.profile(),
        queryFn: getProfile,
        staleTime: Infinity,
        retry: false,
    })

    useEffect(() => {
        console.log('[useSetupUserRole] user:', user, 'isLoading:', isLoading, 'error:', error)
        if (user?.role) {
            console.log('[useSetupUserRole] Setting role:', user.role)
            setCachedUserRole(user.role)
        }
    }, [user?.role, user, isLoading, error])

    return user
}

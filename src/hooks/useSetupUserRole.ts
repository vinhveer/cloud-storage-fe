import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/api/features/auth/auth.api'
import { qk } from '@/api/query/keys'

/**
 * Hook: Get user profile from API
 */
export function useSetupUserRole() {
    const { data: user } = useQuery({
        queryKey: qk.auth.profile(),
        queryFn: getProfile,
        retry: false,
        refetchOnMount: 'always',
    })

    return user
}

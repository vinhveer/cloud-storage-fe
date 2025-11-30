import { queryClient } from '@/api/query/client'
import { qk } from '@/api/query/keys'
import type { AuthenticatedUser } from '@/api/features/auth/auth.types'

/**
 * Role types
 */
export type UserRole = 'admin' | 'user' | 'viewer'

type RoleListener = () => void
const roleListeners = new Set<RoleListener>()
let roleVersionCounter = 0

export function subscribeToRoleChanges(listener: RoleListener) {
    roleListeners.add(listener)
    return () => {
        roleListeners.delete(listener)
    }
}

export function getRoleVersion() {
    return roleVersionCounter
}

/**
 * Get user profile from React Query cache
 */
function getUserFromCache(): AuthenticatedUser | null {
    try {
        if (typeof window === 'undefined') return null
        const user = queryClient.getQueryData<AuthenticatedUser>(qk.auth.profile())
        return user ?? null
    } catch {
        return null
    }
}

/**
 * Check if user has admin role
 */
export function isAdmin(): boolean {
    const user = getUserFromCache()
    return user?.role === 'admin'
}

/**
 * Check if user has specific role
 */
export function hasRole(role: UserRole): boolean {
    const user = getUserFromCache()
    return user?.role === role
}

/**
 * Get user role
 */
export function getUserRole(): UserRole {
    const user = getUserFromCache()
    return user?.role ?? 'user'
}

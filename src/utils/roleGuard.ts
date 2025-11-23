/**
 * Role types
 */
export type UserRole = 'admin' | 'user' | 'viewer'

/**
 * Get user role from React Query cache or localStorage
 */
function getUserRoleFromCache(): UserRole | null {
    try {
        if (typeof window === 'undefined') return null

        // 1. Prefer persisted role from localStorage (survives reload)
        const stored = window.localStorage.getItem('user-role') as UserRole | null
        if (stored) return stored

        // 2. Fallback to window cache (set at runtime)
        if ((window as any).__userRole) {
            return (window as any).__userRole
        }
    } catch {
        // Silently fail
    }
    return null
}

/**
 * Check if user has admin role
 * Checks: localStorage mock > window cache > default false
 */
export function isAdmin(): boolean {
    // 1. Check mock role first (for testing)
    const mockRole = localStorage.getItem('mock-user-role')
    if (mockRole === 'admin') return true

    // 2. Check from cache/window (set by components)
    const cachedRole = getUserRoleFromCache()
    if (cachedRole === 'admin') return true

    return false
}

/**
 * Check if user has specific role
 */
export function hasRole(role: UserRole): boolean {
    // 1. Check mock role first (for testing)
    const mockRole = localStorage.getItem('mock-user-role') as UserRole | null
    if (mockRole === role) return true

    // 2. Check from cache/window
    const cachedRole = getUserRoleFromCache()
    if (cachedRole === role) return true

    return false
}

/**
 * Get user role (mock + cache)
 */
export function getUserRole(): UserRole {
    // 1. Check mock role first (for testing)
    const mockRole = localStorage.getItem('mock-user-role') as UserRole | null
    if (mockRole) return mockRole

    // 2. Check from cache/window
    const cachedRole = getUserRoleFromCache()
    if (cachedRole) return cachedRole

    return 'user'
}

/**
 * Set user role to window cache (called by components that have user data)
 * @internal Used by providers/components with access to user data
 */
export function setCachedUserRole(role: UserRole): void {
    if (typeof window !== 'undefined') {
        (window as any).__userRole = role
        try {
            window.localStorage.setItem('user-role', role)
        } catch {
            // ignore storage errors
        }
    }
}

/**
 * Set mock role for testing (remove khi có API thực)
 */
export function setMockRole(role: UserRole): void {
    localStorage.setItem('mock-user-role', role)
    window.location.reload()
}

/**
 * Clear mock role
 */
export function clearMockRole(): void {
    localStorage.removeItem('mock-user-role')
    window.location.reload()
}
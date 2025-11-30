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
 * Check if user has admin role
 */
export function isAdmin(): boolean {
    return false
}

/**
 * Check if user has specific role
 */
export function hasRole(_role: UserRole): boolean {
    return false
}

/**
 * Get user role
 */
export function getUserRole(): UserRole {
    return 'user'
}

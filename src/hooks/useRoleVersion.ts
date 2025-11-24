import { useSyncExternalStore } from 'react'
import { getRoleVersion, subscribeToRoleChanges } from '@/utils/roleGuard'

export function useRoleVersion() {
    return useSyncExternalStore(subscribeToRoleChanges, getRoleVersion, getRoleVersion)
}

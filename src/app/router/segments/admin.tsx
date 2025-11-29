import { createAccessRoute } from '../route-factories'
import { rootRoute } from '../root'
import AppLayout from '@/app/layout/AppLayout'
import AdminOverviewPage from '@/app/pages/samples/admin/overview'
import AdminUserManagementPage from '@/app/pages/samples/admin/user-management'
import AdminStorageUsersPage from '@/app/pages/samples/admin/storage-users'
import { isAdmin } from '@/utils/roleGuard'
import { redirect } from '@tanstack/react-router'

/**
 * Admin routes - Requires admin role
 * Route: /samples/admin/*
 */
export const adminRoute = createAccessRoute({
    getParentRoute: () => rootRoute,
    path: '/samples/admin',
    component: AppLayout,
    access: 'protected',
    beforeLoad: () => {
        // Check if user is admin
        if (typeof window !== 'undefined' && !isAdmin()) {
            throw redirect({ to: '/samples' })
        }
    },
})

const adminOverviewRoute = createAccessRoute({
    getParentRoute: () => adminRoute,
    path: '/overview',
    component: AdminOverviewPage,
    access: 'protected',
})

const adminUserManagementRoute = createAccessRoute({
    getParentRoute: () => adminRoute,
    path: '/user-management',
    component: AdminUserManagementPage,
    access: 'protected',
})

const adminStorageUsersRoute = createAccessRoute({
    getParentRoute: () => adminRoute,
    path: '/storage-users',
    component: AdminStorageUsersPage,
    access: 'protected',
})

export function getAdminRoutes() {
    return adminRoute.addChildren([
        adminOverviewRoute,
        adminUserManagementRoute,
        adminStorageUsersRoute,
    ])
}
import { createAccessRoute } from '../route-factories'
import { rootRoute } from '../root'
import AppLayout from '@/app/layout/AppLayout'
import AdminOverviewPage from '@/app/pages/admin-overview/admin-overview'
import AdminUserManagementPage from '@/app/pages/samples/admin/user-management'
import AdminStorageUsersPage from '@/app/pages/samples/admin/storage-users'
import AdminConfigsPage from '@/app/pages/admin-configs/admin-configs'
import { isAdmin } from '@/utils/roleGuard'
import { redirect } from '@tanstack/react-router'

/**
 * Admin routes - Requires admin role
 * Route: /admin/*
 */
export const adminRoute = createAccessRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: AppLayout,
    access: 'protected',
    beforeLoad: () => {
        // Check if user is admin
        if (typeof window !== 'undefined' && !isAdmin()) {
            throw redirect({ to: '/' })
        }
    },
})

const adminOverviewRoute = createAccessRoute({
    getParentRoute: () => adminRoute,
    path: '/',
    component: AdminOverviewPage,
    access: 'protected',
})

const adminUserManagementRoute = createAccessRoute({
    getParentRoute: () => adminRoute,
    path: '/users',
    component: AdminUserManagementPage,
    access: 'protected',
})

const adminStorageUsersRoute = createAccessRoute({
    getParentRoute: () => adminRoute,
    path: '/storage',
    component: AdminStorageUsersPage,
    access: 'protected',
})

const adminConfigsRoute = createAccessRoute({
    getParentRoute: () => adminRoute,
    path: '/configs',
    component: AdminConfigsPage,
    access: 'protected',
})

export function getAdminRoutes() {
    return adminRoute.addChildren([
        adminOverviewRoute,
        adminUserManagementRoute,
        adminStorageUsersRoute,
        adminConfigsRoute,
    ])
}
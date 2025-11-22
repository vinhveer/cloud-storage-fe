import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AlertProvider } from '@/components/Alert/AlertProvider'

export const rootRoute = createRootRoute({
    component: () => (
        <AlertProvider>
            <Outlet />
        </AlertProvider>
    ),
})
import Navbar from '@/components/Navbar/Navbar'
import { Outlet } from '@tanstack/react-router'
import Sidebar from '@/components/Sidebar/Sidebar'
import SidebarSync from '@/app/router/components/SidebarSync'

export default function AppLayout() {
  return (
    <>
      <SidebarSync />
      <div className="min-h-dvh flex flex-col bg-white dark:bg-[#0D1117] text-gray-900 dark:text-gray-100">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 ml-64 h-[calc(100dvh-var(--navbar-h)-1px)] overflow-y-auto">
            <div className="container mx-auto p-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
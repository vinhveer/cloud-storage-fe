import { useState } from 'react'
import Navbar from '@/components/Navbar/Navbar'
import { Outlet } from '@tanstack/react-router'
import Sidebar from '@/components/Sidebar/Sidebar'
import SidebarSync from '@/app/router/components/SidebarSync'

export default function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <>
      <SidebarSync />
      <div className="h-dvh overflow-hidden flex flex-col bg-white dark:bg-[#0D1117] text-gray-900 dark:text-gray-100">
        <Navbar onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)} />
        <div className="flex flex-1 min-h-0">
          <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
          <main className="flex-1 lg:ml-64 overflow-y-auto">
            <div className="container mx-auto p-4 h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
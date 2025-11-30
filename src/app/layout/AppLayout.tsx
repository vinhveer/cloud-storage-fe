import { useState, type ReactNode } from 'react'
import { Outlet, useLocation, useSearch } from '@tanstack/react-router'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import SidebarSync from '@/app/router/components/SidebarSync'

type AppLayoutProps = {
  children?: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps = {} as AppLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const search = useSearch({ strict: false }) as { folderId?: string }
  
  // Only pass folderId if we're on my-files page
  const isMyFilesPage = location.pathname === '/my-files'
  const currentFolderId = isMyFilesPage && search.folderId ? parseInt(search.folderId, 10) : null

  return (
    <>
      <SidebarSync />
      <div className="h-dvh overflow-hidden flex flex-col bg-white dark:bg-[#0D1117] text-gray-900 dark:text-gray-100">
        <Navbar currentFolderId={currentFolderId} onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)} />
        <div className="flex flex-1 min-h-0">
          <Sidebar mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
          <main className="flex-1 lg:ml-64 overflow-y-auto">
            <div className="container mx-auto p-4 h-full">
              {children ?? <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
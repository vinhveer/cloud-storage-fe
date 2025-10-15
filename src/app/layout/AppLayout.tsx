import Navbar from '@/components/Navbar/Navbar'
import { Outlet } from '@tanstack/react-router'
import Sidebar from '@/components/Sidebar/Sidebar'
import { SidebarProvider } from '@/contexts/SidebarContext'

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-dvh flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}



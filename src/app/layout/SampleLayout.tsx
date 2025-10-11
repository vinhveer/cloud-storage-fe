import { Outlet } from '@tanstack/react-router'
import SampleSidebar from '@/components/sample/Sidebar'

export default function SampleLayout() {
  return (
    <div className="flex min-h-dvh">
      <div className="sticky top-0 h-dvh overflow-y-auto">
        <SampleSidebar />
      </div>
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}



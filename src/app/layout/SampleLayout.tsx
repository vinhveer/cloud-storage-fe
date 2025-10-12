import { Outlet } from '@tanstack/react-router'

export default function SampleLayout() {
  return (
    <main className="min-h-dvh overflow-y-auto">
      <div className="container mx-auto p-4">
        <Outlet />
      </div>
    </main>
  )
}



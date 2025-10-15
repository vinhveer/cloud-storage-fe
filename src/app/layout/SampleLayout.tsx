import { Outlet } from '@tanstack/react-router'

export default function SampleLayout() {
  return (
    <main className="min-h-dvh overflow-y-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto p-4">
        <Outlet />
      </div>
    </main>
  )
}
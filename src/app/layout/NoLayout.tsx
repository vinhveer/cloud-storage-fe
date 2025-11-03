import React from 'react'
import { Outlet } from '@tanstack/react-router'

export default function NoLayout() {
  return (
    <div className="min-h-dvh bg-white dark:bg-[#0D1117] text-gray-900 dark:text-gray-100">
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}



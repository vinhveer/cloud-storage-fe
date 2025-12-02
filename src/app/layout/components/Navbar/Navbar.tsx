import clsx from 'clsx'
import { Bars3Icon, MagnifyingGlassIcon, CloudIcon } from '@heroicons/react/24/outline'
import AccountDropdown from './AccountDropdown/AccountDropdown'
import Search from './Search/Search'
import SearchModal from './Search/SearchModal'
import ThemeToggle from './ThemeToggle/ThemeToggle'
import UploadButton from './UploadButton/UploadButton'
import type { NavbarProps } from './types'
import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/api/features/auth/auth.api'
import { qk } from '@/api/query/keys'
import { useNavbar } from '@/app/layout/hooks/useNavbar'
import { useState } from 'react'

export default function Navbar({
  title = 'CloudStorage',
  searchPlaceholder = 'Search everything...',
  className,
  currentFolderId = null,
  onToggleSidebar,
}: Readonly<NavbarProps>) {
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const { handleLogout, logoutError } = useNavbar()

  // Fetch user profile
  const { data: user } = useQuery({
    queryKey: qk.auth.profile(),
    queryFn: getProfile,
  })

  const effectiveTitle = title || 'CloudStorage'

  return (
    <nav className={clsx('sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2', className)}>
      <div className="flex items-center justify-between">
        {/* Left: Brand + page title */}
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Toggle sidebar"
            className="mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
            onClick={() => onToggleSidebar?.()}
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <CloudIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" aria-label="CloudStorage" />
            <span className="hidden lg:inline text-lg font-semibold text-gray-900 dark:text-white">
              {effectiveTitle}
            </span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="hidden lg:flex flex-1 justify-center">
          <Search placeholder={searchPlaceholder} className="w-1/2 md:w-3/5 max-w-3xl mx-8" />
        </div>

        {/* Right: Actions & Account */}
        <div className="flex items-center space-x-3">
          {/* Mobile / tablet search button */}
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            aria-label="Open search"
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
          <ThemeToggle />
          <UploadButton currentFolderId={currentFolderId} />
          <AccountDropdown
            userName={user?.name}
            userEmail={user?.email}
            onLogout={handleLogout}
            settingsHref="/app/account-settings"
          />
        </div>
      </div>
      {logoutError && (
        <p className="text-xs text-red-500 text-right mt-1" role="alert">{logoutError}</p>
      )}

      <SearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </nav>
  )
}



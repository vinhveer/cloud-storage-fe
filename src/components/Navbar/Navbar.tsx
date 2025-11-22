import clsx from 'clsx'
import { ArrowUpTrayIcon, MoonIcon, SunIcon, ComputerDesktopIcon, FolderIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/Button/Button'
import AccountDropdown from '@/components/Navbar/AccountDropdown/AccountDropdown'
import Search from '@/components/Navbar/Search/Search'
import { useTheme } from '@/app/providers/ThemeProvider'
import { useLogout } from '@/api/features/auth/auth.mutations'
import { useNavigate } from '@tanstack/react-router'
import { AppError } from '@/api/core/error'
import { useState } from 'react'
import type { NavbarProps } from '@/components/Navbar/types'

import { useQuery } from '@tanstack/react-query'
import { getProfile } from '@/api/features/auth/auth.api'
import { searchSuggestions } from '@/api/features/search/search.api'
import { qk } from '@/api/query/keys'

export default function Navbar({
  title = 'CloudStorage',
  searchPlaceholder = 'Search everything...',
  className,
}: Readonly<NavbarProps>) {
  const { theme, cycleTheme } = useTheme()
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const [logoutError, setLogoutError] = useState<string | null>(null)

  const { data: user, isLoading, error } = useQuery({
    queryKey: qk.auth.profile(),
    queryFn: getProfile,
  })

  if (error) {
    console.error('Failed to fetch user profile:', error)
  }

  if (user) {
    console.log('User profile loaded:', user)
  }

  async function handleLogout() {
    setLogoutError(null)
    try {
      await logoutMutation.mutateAsync()
      navigate({ to: '/auth/login' })
    } catch (unknownError) {
      const applicationError = unknownError as AppError
      setLogoutError(applicationError.message || 'Đăng xuất thất bại.')
    }
  }
  const handleSearch = async (query: string) => {
    try {
      const data = await searchSuggestions({ q: query, limit: 5 })
      return data.suggestions.map((item) => ({
        id: item.id.toString(),
        title: item.name,
        description: item.full_path,
        url: item.type === 'folder' ? `/my-files?folderId=${item.id}` : `/my-files?fileId=${item.id}`,
        icon: item.type === 'folder' ? <FolderIcon className="w-5 h-5 text-blue-500" /> : <DocumentIcon className="w-5 h-5 text-gray-500" />,
      }))
    } catch (error) {
      console.error('Search failed:', error)
      return []
    }
  }

  return (
    <nav className={clsx('sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2', className)}>
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        </div>

        {/* Center: Search */}
        {/* old: <Search onSearch={onSearch} placeholder={searchPlaceholder} className="flex-1 max-w-md mx-8" /> */}
        <div className="flex-1 flex justify-center">
          <Search onSearch={handleSearch} placeholder={searchPlaceholder} className="w-1/2 md:w-3/5 max-w-3xl mx-8" />
        </div>

        {/* Right: Actions & Account */}
        <div className="flex items-center space-x-3">
          {(() => {
            if (theme === 'dark') {
              return (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={cycleTheme}
                  aria-label="Toggle theme"
                  icon={<SunIcon className="w-4 h-4" />}
                />
              )
            }
            if (theme === 'light') {
              return (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={cycleTheme}
                  aria-label="Toggle theme"
                  icon={<MoonIcon className="w-4 h-4" />}
                />
              )
            }
            return (
              <Button
                variant="secondary"
                size="md"
                onClick={cycleTheme}
                aria-label="Toggle theme"
                icon={<ComputerDesktopIcon className="w-4 h-4" />}
              />
            )
          })()}
          <Button
            variant="primary"
            size="md"
            icon={<ArrowUpTrayIcon className="w-4 h-4" />}
            aria-label="Upload"
          />
          <AccountDropdown
            onLogout={handleLogout}
            settingsHref="/app/account-settings"
            userName={isLoading ? 'Loading...' : user?.name}
            userEmail={isLoading ? '...' : user?.email}
          />
        </div>
      </div>
      {logoutError && (
        <p className="text-xs text-red-500 text-right mt-1" role="alert">{logoutError}</p>
      )}
    </nav>
  )
}



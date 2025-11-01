 
import type { ReactNode } from 'react'
import clsx from 'clsx'
import { ArrowUpTrayIcon, MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/Button/Button'
import AccountDropdown from '@/components/Navbar/AccountDropdown/AccountDropdown'
import Search from '@/components/Navbar/Search/Search'
import { useTheme } from '@/app/providers/ThemeProvider'

export type NavbarSearchResult = {
  id: string
  url: string
  title: string
  description?: string
  icon?: ReactNode
}

export type NavbarProps = {
  title?: string
  onSearch?: (query: string) => Promise<NavbarSearchResult[]>
  searchPlaceholder?: string
  className?: string
}

export default function Navbar({
  title = 'CloudStorage',
  onSearch,
  searchPlaceholder = 'Search everything...',
  className,
}: NavbarProps) {
  const { theme, cycleTheme } = useTheme()
  return (
    <nav className={clsx('sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2', className)}>
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        </div>

        {/* Center: Search */}
        <Search onSearch={onSearch} placeholder={searchPlaceholder} className="flex-1 max-w-md mx-8" />

        {/* Right: Actions & Account */}
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="md"
            onClick={cycleTheme}
            aria-label="Toggle theme"
            icon={theme === 'dark' ? <SunIcon className="w-4 h-4" /> : theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <ComputerDesktopIcon className="w-4 h-4" />}
          />
          <Button
            variant="primary"
            size="md"
            icon={<ArrowUpTrayIcon className="w-4 h-4" />}
            aria-label="Upload"
          />
          <AccountDropdown />
        </div>
      </div>
    </nav>
  )
}



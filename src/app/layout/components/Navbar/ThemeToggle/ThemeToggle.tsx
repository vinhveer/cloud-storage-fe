import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useThemeToggle } from './hooks/useThemeToggle'
import ThemeMenu from './components/ThemeMenu'

export default function ThemeToggle() {
  const { theme, menuOpen, setMenuOpen, handleSelectTheme, buttonRef, menuRef } = useThemeToggle()

  const getIcon = () => {
    if (theme === 'dark') return <MoonIcon className="w-5 h-5" />
    if (theme === 'light') return <SunIcon className="w-5 h-5" />
    return <ComputerDesktopIcon className="w-5 h-5" />
  }

  const getButtonClassName = () => {
    const baseClasses = 'w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
    if (theme === 'dark') {
      return `${baseClasses} bg-gray-800 dark:bg-gray-800 hover:bg-gray-700 dark:hover:bg-gray-700 text-white`
    }
    if (theme === 'light') {
      return `${baseClasses} bg-gray-100 dark:bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-200 text-gray-900`
    }
    return `${baseClasses} bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300`
  }

  return (
    <div className="relative" ref={buttonRef}>
      <button
        type="button"
        className={getButtonClassName()}
        aria-label="Toggle theme"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        {getIcon()}
      </button>
      {menuOpen && (
        <ThemeMenu
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
          menuRef={menuRef}
        />
      )}
    </div>
  )
}

import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

export type ThemeMenuProps = {
  currentTheme: 'light' | 'dark' | 'system'
  onSelectTheme: (theme: 'light' | 'dark' | 'system') => void
  menuRef: React.RefObject<HTMLDivElement | null>
}

export default function ThemeMenu({ currentTheme, onSelectTheme, menuRef }: Readonly<ThemeMenuProps>) {
  return (
    <div
      ref={menuRef}
      className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50"
    >
      <button
        onClick={() => onSelectTheme('light')}
        className={`w-full flex items-center gap-3 text-left px-4 py-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 ${
          currentTheme === 'light' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''
        }`}
      >
        <SunIcon className="w-5 h-5 flex-shrink-0" />
        <span>Light</span>
      </button>
      <button
        onClick={() => onSelectTheme('dark')}
        className={`w-full flex items-center gap-3 text-left px-4 py-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 ${
          currentTheme === 'dark' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''
        }`}
      >
        <MoonIcon className="w-5 h-5 flex-shrink-0" />
        <span>Dark</span>
      </button>
      <button
        onClick={() => onSelectTheme('system')}
        className={`w-full flex items-center gap-3 text-left px-4 py-3 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 ${
          currentTheme === 'system' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : ''
        }`}
      >
        <ComputerDesktopIcon className="w-5 h-5 flex-shrink-0" />
        <span>System</span>
      </button>
    </div>
  )
}


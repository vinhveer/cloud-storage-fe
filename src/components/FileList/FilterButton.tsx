import { FunnelIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

type FilterButtonProps = {
  onClick?: () => void
  className?: string
}

export default function FilterButton({ onClick, className }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200',
        className,
      )}
      aria-label="Filter"
    >
      <FunnelIcon className="w-4 h-4" aria-hidden="true" />
      <span>Filter</span>
    </button>
  )
}



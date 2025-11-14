import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import type { SortButtonProps } from '@/components/FileList/SortButton.types'

export default function SortButton({ onClick, className }: Readonly<SortButtonProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200',
        className,
      )}
      aria-label="Sort"
    >
      <ArrowsUpDownIcon className="w-4 h-4" aria-hidden="true" />
      <span>Sort</span>
    </button>
  )
}



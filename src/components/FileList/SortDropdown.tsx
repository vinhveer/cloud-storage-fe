import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export type SortOption =
    | 'name-asc'
    | 'name-desc'
    | 'size-desc'
    | 'size-asc'
    | 'date-desc'
    | 'date-asc'

export type SortDropdownProps = {
    value: SortOption
    onChange: (value: SortOption) => void
    className?: string
}

// Order of sort cycling: Name A-Z → Name Z-A → Size Large → Size Small → Date New → Date Old → repeat
const sortCycle: { value: SortOption; label: string; shortLabel: string }[] = [
    { value: 'name-asc', label: 'Name (A → Z)', shortLabel: 'A→Z' },
    { value: 'name-desc', label: 'Name (Z → A)', shortLabel: 'Z→A' },
    { value: 'size-desc', label: 'Size (Largest)', shortLabel: 'Size ↓' },
    { value: 'size-asc', label: 'Size (Smallest)', shortLabel: 'Size ↑' },
    { value: 'date-desc', label: 'Date (Newest)', shortLabel: 'New' },
    { value: 'date-asc', label: 'Date (Oldest)', shortLabel: 'Old' },
]

export default function SortDropdown({ value, onChange, className }: Readonly<SortDropdownProps>) {
    const currentIndex = sortCycle.findIndex(opt => opt.value === value)
    const currentOption = sortCycle[currentIndex] ?? sortCycle[0]

    const handleClick = () => {
        const nextIndex = (currentIndex + 1) % sortCycle.length
        onChange(sortCycle[nextIndex].value)
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            title={currentOption.label}
            className={clsx(
                'flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200',
                className
            )}
            aria-label={`Sort: ${currentOption.label}`}
        >
            <ArrowsUpDownIcon className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{currentOption.shortLabel}</span>
            <span className="sm:hidden">Sort</span>
        </button>
    )
}

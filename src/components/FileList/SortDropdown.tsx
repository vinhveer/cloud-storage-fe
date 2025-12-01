import React from 'react'
import { ArrowsUpDownIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
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

const sortOptions: { value: SortOption; label: string; shortLabel: string }[] = [
    { value: 'name-asc', label: 'Name (A → Z)', shortLabel: 'A→Z' },
    { value: 'name-desc', label: 'Name (Z → A)', shortLabel: 'Z→A' },
    { value: 'size-desc', label: 'Size (Largest)', shortLabel: 'Size ↓' },
    { value: 'size-asc', label: 'Size (Smallest)', shortLabel: 'Size ↑' },
    { value: 'date-desc', label: 'Date (Newest)', shortLabel: 'New' },
    { value: 'date-asc', label: 'Date (Oldest)', shortLabel: 'Old' },
]

export default function SortDropdown({ value, onChange, className }: Readonly<SortDropdownProps>) {
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    const currentOption = sortOptions.find(opt => opt.value === value) ?? sortOptions[0]

    React.useEffect(() => {
        if (!isOpen) return
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    return (
        <div ref={dropdownRef} className={clsx('relative', className)}>
            <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className={clsx(
                    'flex items-center space-x-2 px-3 py-2 text-sm font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200',
                    'text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <ArrowsUpDownIcon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{currentOption.shortLabel}</span>
                <span className="sm:hidden">Sort</span>
                <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Sort by</span>
                    </div>
                    <div className="py-1">
                        {sortOptions.map(option => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value)
                                    setIsOpen(false)
                                }}
                                className={clsx(
                                    'flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors',
                                    value === option.value
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                )}
                            >
                                <span className={clsx(
                                    'w-3 h-3 rounded-full border mr-2',
                                    value === option.value
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'border-gray-300 dark:border-gray-600'
                                )} />
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

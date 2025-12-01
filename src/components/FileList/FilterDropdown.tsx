import React from 'react'
import { FunnelIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export type FileTypeFilter = 'all' | 'folder' | 'image' | 'document' | 'video' | 'audio' | 'other'
export type DateFilter = 'all' | 'today' | 'week' | 'month'
export type SizeFilter = 'all' | 'small' | 'medium' | 'large'

export type FilterState = {
    fileType: FileTypeFilter
    date: DateFilter
    size: SizeFilter
}

export type FilterDropdownProps = {
    value: FilterState
    onChange: (value: FilterState) => void
    className?: string
}

const fileTypeOptions: { value: FileTypeFilter; label: string }[] = [
    { value: 'all', label: 'All types' },
    { value: 'folder', label: 'Folders only' },
    { value: 'image', label: 'Images (PNG, JPG, GIF...)' },
    { value: 'document', label: 'Documents (PDF, DOC...)' },
    { value: 'video', label: 'Videos (MP4, MOV...)' },
    { value: 'audio', label: 'Audio (MP3, WAV...)' },
    { value: 'other', label: 'Other files' },
]

const dateOptions: { value: DateFilter; label: string }[] = [
    { value: 'all', label: 'Any time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' },
]

const sizeOptions: { value: SizeFilter; label: string }[] = [
    { value: 'all', label: 'Any size' },
    { value: 'small', label: 'Small (< 1 MB)' },
    { value: 'medium', label: 'Medium (1 - 10 MB)' },
    { value: 'large', label: 'Large (> 10 MB)' },
]

export default function FilterDropdown({ value, onChange, className }: Readonly<FilterDropdownProps>) {
    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const [maxHeight, setMaxHeight] = React.useState<string>('80vh')

    const hasActiveFilters = value.fileType !== 'all' || value.date !== 'all' || value.size !== 'all'
    const activeFilterCount = [
        value.fileType !== 'all',
        value.date !== 'all',
        value.size !== 'all',
    ].filter(Boolean).length

    React.useEffect(() => {
        if (!isOpen || !buttonRef.current) return

        const calculateMaxHeight = () => {
            const buttonRect = buttonRef.current?.getBoundingClientRect()
            if (!buttonRect) return

            const spaceBelow = window.innerHeight - buttonRect.bottom - 8
            const spaceAbove = buttonRect.top - 8
            const maxAvailableSpace = Math.max(spaceBelow, spaceAbove)

            const maxHeightValue = Math.min(maxAvailableSpace, window.innerHeight * 0.8)
            setMaxHeight(`${maxHeightValue}px`)
        }

        calculateMaxHeight()
        window.addEventListener('resize', calculateMaxHeight)
        window.addEventListener('scroll', calculateMaxHeight, true)

        return () => {
            window.removeEventListener('resize', calculateMaxHeight)
            window.removeEventListener('scroll', calculateMaxHeight, true)
        }
    }, [isOpen])

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

    const handleClearAll = () => {
        onChange({ fileType: 'all', date: 'all', size: 'all' })
    }

    const activeFilterLabels = React.useMemo(() => {
        const labels: string[] = []
        if (value.fileType !== 'all') {
            const option = fileTypeOptions.find(opt => opt.value === value.fileType)
            if (option) labels.push(option.label)
        }
        if (value.date !== 'all') {
            const option = dateOptions.find(opt => opt.value === value.date)
            if (option) labels.push(option.label)
        }
        if (value.size !== 'all') {
            const option = sizeOptions.find(opt => opt.value === value.size)
            if (option) labels.push(option.label)
        }
        return labels
    }, [value])

    return (
        <div ref={dropdownRef} className={clsx('relative', className)}>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className={clsx(
                    'flex items-center space-x-2 px-3 py-2 text-sm font-medium border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200',
                    hasActiveFilters
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                        : 'text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <FunnelIcon className="w-4 h-4" aria-hidden="true" />
                {hasActiveFilters && activeFilterLabels.length > 0 ? (
                    <span className="hidden sm:inline truncate max-w-[120px]">{activeFilterLabels[0]}</span>
                ) : (
                    <span>Filter</span>
                )}
                {activeFilterCount > 1 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
                        +{activeFilterCount - 1}
                    </span>
                )}
                <ChevronDownIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[100] overflow-y-auto table-data-scrollbar"
                    style={{ maxHeight }}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Filters</span>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                                <XMarkIcon className="w-3 h-3" />
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="py-2">
                        {/* File Type */}
                        <div className="px-3 pt-3">
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                File type
                            </div>
                            <div className="space-y-1">
                                {fileTypeOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => onChange({ ...value, fileType: option.value })}
                                        className={clsx(
                                            'flex items-center w-full px-3 py-1.5 text-sm rounded-md transition-colors',
                                            value.fileType === option.value
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
                                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        )}
                                    >
                                        <span className={clsx(
                                            'w-3 h-3 rounded-full border mr-2',
                                            value.fileType === option.value
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-gray-300 dark:border-gray-600'
                                        )} />
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date Modified */}
                        <div className="px-3 pt-3">
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                Modified date
                            </div>
                            <div className="space-y-1">
                                {dateOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => onChange({ ...value, date: option.value })}
                                        className={clsx(
                                            'flex items-center w-full px-3 py-1.5 text-sm rounded-md transition-colors',
                                            value.date === option.value
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
                                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        )}
                                    >
                                        <span className={clsx(
                                            'w-3 h-3 rounded-full border mr-2',
                                            value.date === option.value
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-gray-300 dark:border-gray-600'
                                        )} />
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size */}
                        <div className="px-3 pt-3 pb-3">
                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                File size
                            </div>
                            <div className="space-y-1">
                                {sizeOptions.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => onChange({ ...value, size: option.value })}
                                        className={clsx(
                                            'flex items-center w-full px-3 py-1.5 text-sm rounded-md transition-colors',
                                            value.size === option.value
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200'
                                                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        )}
                                    >
                                        <span className={clsx(
                                            'w-3 h-3 rounded-full border mr-2',
                                            value.size === option.value
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-gray-300 dark:border-gray-600'
                                        )} />
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

import type { FileItem } from './types'
import type { SortOption } from './SortDropdown'
import type { FilterState } from './FilterDropdown'

// Parse size string to bytes
export function parseSizeToBytes(sizeStr?: string): number {
    if (!sizeStr) return 0

    const match = sizeStr.match(/^([\d.]+)\s*(B|KB|MB|GB|TB)?$/i)
    if (!match) return 0

    const value = parseFloat(match[1])
    const unit = (match[2] || 'B').toUpperCase()

    const multipliers: Record<string, number> = {
        'B': 1,
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
        'TB': 1024 * 1024 * 1024 * 1024,
    }

    return value * (multipliers[unit] || 1)
}

// Parse date string to Date object
export function parseDate(dateStr?: string): Date | null {
    if (!dateStr) return null

    // Try parsing common date formats
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) return date

    return null
}

// Get file extension
export function getFileExtension(name: string): string {
    const match = name.match(/\.([^.]+)$/)
    return match ? match[1].toLowerCase() : ''
}

// Check if file matches type filter
export function matchesFileType(item: FileItem, filter: FilterState['fileType']): boolean {
    if (filter === 'all') return true

    const type = (item.type ?? '').toLowerCase()
    const ext = getFileExtension(item.name)

    switch (filter) {
        case 'folder':
            return type === 'folder'
        case 'image':
            return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico', 'tiff', 'heic', 'heif'].includes(ext) ||
                ['png', 'jpg', 'jpeg', 'gif', 'webp', 'image'].includes(type)
        case 'document':
            return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp', 'csv'].includes(ext) ||
                ['pdf', 'document', 'spreadsheet', 'presentation'].includes(type)
        case 'video':
            return ['mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'm4v'].includes(ext) ||
                type === 'video'
        case 'audio':
            return ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'].includes(ext) ||
                type === 'audio'
        case 'other':
            // Not folder and not any of the above
            if (type === 'folder') return false
            const knownExts = [
                'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico', 'tiff', 'heic', 'heif',
                'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp', 'csv',
                'mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'm4v',
                'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'
            ]
            return !knownExts.includes(ext)
        default:
            return true
    }
}

// Check if file matches date filter
export function matchesDateFilter(item: FileItem, filter: FilterState['date']): boolean {
    if (filter === 'all') return true

    const date = parseDate(item.modified)
    if (!date) return false // No date means we can't filter, exclude from date filters

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfToday)
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay()) // Sunday
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    switch (filter) {
        case 'today':
            return date >= startOfToday
        case 'week':
            return date >= startOfWeek
        case 'month':
            return date >= startOfMonth
        default:
            return true
    }
}

// Check if file matches size filter
export function matchesSizeFilter(item: FileItem, filter: FilterState['size']): boolean {
    if (filter === 'all') return true

    // Folders don't have size, include them in all filters
    const type = (item.type ?? '').toLowerCase()
    if (type === 'folder') return true

    const bytes = parseSizeToBytes(item.size)
    const MB = 1024 * 1024

    switch (filter) {
        case 'small':
            return bytes < 1 * MB
        case 'medium':
            return bytes >= 1 * MB && bytes <= 10 * MB
        case 'large':
            return bytes > 10 * MB
        default:
            return true
    }
}

// Filter files based on filter state
export function filterFiles(files: FileItem[], filter: FilterState): FileItem[] {
    return files.filter(item =>
        matchesFileType(item, filter.fileType) &&
        matchesDateFilter(item, filter.date) &&
        matchesSizeFilter(item, filter.size)
    )
}

// Sort files based on sort option
export function sortFiles(files: FileItem[], sort: SortOption): FileItem[] {
    const sorted = [...files]

    // Always put folders first
    sorted.sort((a, b) => {
        const aIsFolder = (a.type ?? '').toLowerCase() === 'folder'
        const bIsFolder = (b.type ?? '').toLowerCase() === 'folder'

        if (aIsFolder && !bIsFolder) return -1
        if (!aIsFolder && bIsFolder) return 1

        // Both are same type, apply sort
        switch (sort) {
            case 'name-asc':
                return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
            case 'name-desc':
                return b.name.localeCompare(a.name, undefined, { sensitivity: 'base' })
            case 'size-asc': {
                const aSize = parseSizeToBytes(a.size)
                const bSize = parseSizeToBytes(b.size)
                return aSize - bSize
            }
            case 'size-desc': {
                const aSize = parseSizeToBytes(a.size)
                const bSize = parseSizeToBytes(b.size)
                return bSize - aSize
            }
            case 'date-asc': {
                const aDate = parseDate(a.modified)?.getTime() ?? 0
                const bDate = parseDate(b.modified)?.getTime() ?? 0
                return aDate - bDate
            }
            case 'date-desc': {
                const aDate = parseDate(a.modified)?.getTime() ?? 0
                const bDate = parseDate(b.modified)?.getTime() ?? 0
                return bDate - aDate
            }
            default:
                return 0
        }
    })

    return sorted
}

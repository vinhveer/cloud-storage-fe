import type React from 'react'

/**
 * Định nghĩa một hàng trong bảng
 * T là generic type của dữ liệu
 */
export type TableRow<T> = T & {
    id: string | number
}

/**
 * Cột của bảng
 * key: khóa trường dữ liệu
 * label: tên hiển thị (tiếng Việt)
 * render: tùy chỉnh render (optional)
 * width: độ rộng cột (optional)
 * sortable: có thể sort hay không
 * align: căn lề: left, center, right
 */
export type TableColumn<T> = {
    key: keyof T
    label: string
    render?: (value: T[keyof T], row: T) => React.ReactNode
    width?: string
    sortable?: boolean
    align?: 'left' | 'center' | 'right'
}

/**
 * Props của Table component
 * T là generic type của dữ liệu trong bảng
 */
export type TableProps<T extends { id: string | number }> = {
    columns: TableColumn<T>[]
    data: T[]
    className?: string
    rowClassName?: string
    headerClassName?: string
    loading?: boolean
    emptyMessage?: string
    onRowClick?: (row: T) => void
    selectable?: boolean
    onSelectionChange?: (selectedIds: (string | number)[]) => void
}

/**
 * Khai báo type cho header config
 * Dùng để định nghĩa cấu trúc cột kèm mapping tiếng Việt
 */
export type TableHeaderConfig<T> = {
    [K in keyof T]?: {
        label: string
        sortable?: boolean
        align?: 'left' | 'center' | 'right'
        width?: string
    }
}

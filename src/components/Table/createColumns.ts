import type { TableColumn, TableHeaderConfig } from './types'

/**
 * Hàm tiện ích: Chuyển đổi header config → columns
 * Giúp định nghĩa cột dễ dàng hơn
 *
 * Ví dụ:
 * const columns = createColumns<User>({
 *   fullname: { label: 'Họ và tên', sortable: true },
 *   email: { label: 'Email', align: 'left' },
 *   phone: { label: 'Điện thoại', width: '120px' },
 * })
 */
export function createColumns<T extends { id: string | number }>(
    config: TableHeaderConfig<T>
): TableColumn<T>[] {
    return Object.entries(config).map(([key, value]) => {
        if (!value) return null
        return {
            key: key as keyof T,
            label: value.label,
            sortable: value.sortable ?? false,
            align: value.align ?? 'left',
            width: value.width,
        }
    }).filter(Boolean) as TableColumn<T>[]
}

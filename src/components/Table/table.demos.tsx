import React from 'react'
import Table from './Table'
import { createColumns } from './createColumns'
import { mockUsers, mockProducts, type User, type Product } from './mockData'

/**
 * Demo 1: User table cơ bản
 */
export function BasicUserTableDemo() {
    const columns = createColumns<User>({
        fullname: { label: 'Họ và tên', sortable: true },
        email: { label: 'Email', sortable: true },
        phone: { label: 'Điện thoại' },
        role: { label: 'Vai trò' },
        status: { label: 'Trạng thái' },
        joinedDate: { label: 'Ngày tham gia', sortable: true },
    })

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Danh sách người dùng</h3>
            <Table<User>
                columns={columns}
                data={mockUsers}
                onRowClick={row => console.log('Clicked:', row)}
            />
        </div>
    )
}

/**
 * Demo 2: User table với selection
 */
export function SelectableUserTableDemo() {
    const [selectedIds, setSelectedIds] = React.useState<(string | number)[]>([])

    const columns = createColumns<User>({
        fullname: { label: 'Họ và tên' },
        email: { label: 'Email' },
        phone: { label: 'Điện thoại' },
        status: { label: 'Trạng thái' },
    })

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">Danh sách người dùng (có chọn)</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Đã chọn {selectedIds.length}/{mockUsers.length}
                </p>
            </div>
            <Table<User>
                columns={columns}
                data={mockUsers}
                selectable
                onSelectionChange={setSelectedIds}
            />
        </div>
    )
}

/**
 * Demo 3: Product table với custom render
 */
export function ProductTableDemo() {
    const columns = createColumns<Product>({
        name: { label: 'Tên sản phẩm', sortable: true },
        category: { label: 'Danh mục', sortable: true },
        price: { label: 'Giá', align: 'right' as const },
        stock: { label: 'Kho', align: 'center' as const },
        status: { label: 'Trạng thái' },
    })

    // Add custom render cho price và status
    columns.forEach(col => {
        if (col.key === 'price') {
            col.render = (value: any) => {
                return new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                }).format(value)
            }
        }
        if (col.key === 'status') {
            col.render = (value: any) => {
                const statusMap: Record<string, string> = {
                    available: 'Có sẵn',
                    discontinued: 'Ngừng bán',
                }
                return (
                    <span
                        className={`inline-flex px-2 py-1 rounded text-sm font-medium ${value === 'available'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                    >
                        {statusMap[value] || value}
                    </span>
                )
            }
        }
    })

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Danh sách sản phẩm</h3>
            <Table<Product> columns={columns} data={mockProducts} emptyMessage="Không có sản phẩm" />
        </div>
    )
}

/**
 * Demo 4: Table rỗng
 */
export function EmptyTableDemo() {
    const columns = createColumns<User>({
        fullname: { label: 'Họ và tên' },
        email: { label: 'Email' },
        phone: { label: 'Điện thoại' },
    })

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bảng rỗng</h3>
            <Table<User> columns={columns} data={[]} emptyMessage="Chưa có dữ liệu người dùng" />
        </div>
    )
}

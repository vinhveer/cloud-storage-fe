import { useState } from 'react'
import Table from '@/components/Table/Table'
import { createColumns } from '@/components/Table/createColumns'
import { mockUsers, type User } from '@/components/Table/mockData'

export default function AdminUserManagementPage() {
    const [selectedUserIds, setSelectedUserIds] = useState<(string | number)[]>([])

    const columns = createColumns<User>({
        fullname: { label: 'Họ và tên', sortable: true },
        email: { label: 'Email', sortable: true },
        phone: { label: 'Điện thoại' },
        role: { label: 'Vai trò', sortable: true },
        status: { label: 'Trạng thái' },
        joinedDate: { label: 'Ngày tham gia', sortable: true },
    })

    // Custom render cho role và status
    columns.forEach(col => {
        if (col.key === 'role') {
            col.render = (value: any) => {
                const roleMap: Record<string, { label: string; bg: string }> = {
                    admin: { label: 'Admin', bg: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
                    user: { label: 'User', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
                    viewer: { label: 'Viewer', bg: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
                }
                const roleInfo = roleMap[value] || { label: value, bg: 'bg-gray-100' }
                return (
                    <span className={`inline-flex px-2 py-1 rounded text-sm font-medium ${roleInfo.bg}`}>
                        {roleInfo.label}
                    </span>
                )
            }
        }
        if (col.key === 'status') {
            col.render = (value: any) => {
                const statusMap: Record<string, string> = {
                    active: 'Hoạt động',
                    inactive: 'Không hoạt động',
                }
                return (
                    <span
                        className={`inline-flex px-2 py-1 rounded text-sm font-medium ${value === 'active'
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
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
                    User Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Quản lý người dùng và phân quyền
                </p>
            </header>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Danh sách người dùng
                    </h2>
                    {selectedUserIds.length > 0 && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Đã chọn {selectedUserIds.length}/{mockUsers.length}
                        </div>
                    )}
                </div>

                <Table<User>
                    columns={columns}
                    data={mockUsers}
                    selectable
                    onSelectionChange={setSelectedUserIds}
                    onRowClick={row => console.log('Selected user:', row)}
                    emptyMessage="Không có người dùng"
                />
            </section>

            {selectedUserIds.length > 0 && (
                <section className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Hành động với {selectedUserIds.length} người dùng được chọn
                    </h3>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Cập nhật vai trò
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            Kích hoạt
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                            Vô hiệu hóa
                        </button>
                    </div>
                </section>
            )}
        </div>
    )
}

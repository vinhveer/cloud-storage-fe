import Table from '@/components/Table/Table'
import { createColumns } from '@/components/Table/createColumns'
import { mockProducts, type Product } from '@/components/Table/mockData'

export default function AdminOverviewPage() {
    const columns = createColumns<Product>({
        name: { label: 'Tên sản phẩm', sortable: true },
        category: { label: 'Danh mục', sortable: true },
        price: { label: 'Giá', align: 'right' as const },
        stock: { label: 'Kho', align: 'center' as const },
        status: { label: 'Trạng thái' },
    })

    // Add custom render
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
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
                    Overview
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Tổng quan về các sản phẩm hiện tại
                </p>
            </header>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Danh sách sản phẩm
                </h2>
                <Table<Product>
                    columns={columns}
                    data={mockProducts}
                    emptyMessage="Không có sản phẩm"
                    onRowClick={row => console.log('Selected product:', row)}
                />
            </section>
        </div>
    )
}

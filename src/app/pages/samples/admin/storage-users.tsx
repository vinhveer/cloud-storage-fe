import React from 'react'
import Table from '@/components/Table/Table'
import { createColumns } from '@/components/Table/createColumns'
import { useAdminStorageUsers } from '@/api/features/storage/storage.queries'
import type { StorageUserItem } from '@/api/features/storage/storage.types'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

type TableStorageUser = StorageUserItem & {
  id: number
}

function bytesToGB(bytes: number): number {
  return bytes / (1024 * 1024 * 1024)
}

function formatBytes(bytes: number): string {
  const gb = bytesToGB(bytes)
  return `${gb.toFixed(2)} GB`
}

export default function AdminStorageUsersPage() {
  const [search, setSearch] = React.useState<string>('')
  const [page, setPage] = React.useState<number>(1)
  const [perPage] = React.useState<number>(15)

  const params = React.useMemo(
    () => ({
      search: search === '' ? undefined : search,
      page,
      per_page: perPage,
    }),
    [search, page, perPage],
  )

  const { data, isLoading, error } = useAdminStorageUsers(params)

  const users: TableStorageUser[] = React.useMemo(
    () => (data?.data ?? []).map(user => ({ ...user, id: user.user_id })),
    [data],
  )

  const columns = createColumns<TableStorageUser>({
    name: { label: 'Name', sortable: true },
    email: { label: 'Email', sortable: true },
    role: { label: 'Role', sortable: true },
    storage_limit: { label: 'Storage Limit', align: 'right' as const },
    storage_used: { label: 'Storage Used', align: 'right' as const },
    usage_percent: { label: 'Usage', align: 'center' as const },
  })

  columns.forEach(col => {
    if (col.key === 'storage_limit' || col.key === 'storage_used') {
      col.render = (value: string | number) => formatBytes(value as number)
    }
    if (col.key === 'usage_percent') {
      col.render = (value: string | number) => {
        const numValue = value as number
        return (
          <span className={`font-medium ${numValue >= 90 ? 'text-red-600 dark:text-red-400' : numValue >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {numValue.toFixed(1)}%
          </span>
        )
      }
    }
    if (col.key === 'role') {
      col.render = (value: string | number) => (
        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
          value === 'admin'
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        }`}>
          {String(value)}
        </span>
      )
    }
  })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  const pagination = data?.pagination

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          Storage Users
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Quản lý dung lượng storage của các user
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </form>

          {pagination && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <span>•</span>
              <span>{pagination.total_items} users</span>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p className="text-sm text-red-800 dark:text-red-200">
              Error loading storage users: {error.message}
            </p>
          </div>
        )}

        <Table<TableStorageUser>
          columns={columns}
          data={users}
          loading={isLoading}
          emptyMessage="No users found"
        />

        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <button
              type="button"
              onClick={() => setPage(p => Math.min(pagination.total_pages, p + 1))}
              disabled={page === pagination.total_pages || isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  )
}


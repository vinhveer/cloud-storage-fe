import React from 'react'
import TableData from '@/components/TableData'
import { createColumns } from '@/components/Table/createColumns'
import { MagnifyingGlassIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import { useConfigs, type TableConfigItem } from './hooks/useConfigs'
import ConfigDetailDialog from './components/ConfigDetailDialog'
import UpdateConfigDialog from './components/UpdateConfigDialog'

export default function AdminConfigsPage() {
  const {
    search,
    setSearch,
    page,
    setPage,
    configs,
    pagination,
    isLoading,
    error,
    refetch,
    selectedConfig,
    setSelectedConfig,
    updateConfig,
    setUpdateConfig,
  } = useConfigs()

  const columns = createColumns<TableConfigItem>({
    config_key: { label: 'Config Key', sortable: true },
    config_value: { label: 'Config Value', sortable: false },
  })

  columns.forEach((col) => {
    if (col.key === 'config_key') {
      col.render = (value: string | number) => (
        <span className="font-mono text-sm text-gray-900 dark:text-white">{String(value)}</span>
      )
    }
    if (col.key === 'config_value') {
      col.render = (value: string | number) => {
        const strValue = String(value)
        const displayValue = strValue.length > 100 ? `${strValue.substring(0, 100)}...` : strValue
        return (
          <span className="font-mono text-sm text-gray-600 dark:text-gray-400" title={strValue}>
            {displayValue}
          </span>
        )
      }
    }
  })

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="space-y-6 mb-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          Config Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Quản lý cấu hình hệ thống
        </p>
      </header>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            Error loading configs: {error.message}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      <section className="space-y-4 flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-shrink-0">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by config key or value..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        <div className="flex-1 min-h-0">
          <TableData<TableConfigItem>
              columns={columns}
              data={configs}
              loading={isLoading}
              emptyMessage="No configs found"
              contextMenuActions={[
                {
                  id: 'view',
                  label: 'View Details',
                  icon: <EyeIcon className="w-4 h-4" />,
                },
                {
                  id: 'edit',
                  label: 'Edit',
                  icon: <PencilIcon className="w-4 h-4" />,
                },
              ]}
              onContextMenuAction={(actionId, row) => {
                if (actionId === 'view') {
                  setSelectedConfig(row)
                } else if (actionId === 'edit') {
                  setUpdateConfig(row)
                }
              }}
              onRowClick={(row) => setSelectedConfig(row)}
          />
        </div>

        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between flex-shrink-0">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total_items} total items)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                    onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                    disabled={page === pagination.total_pages || isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
        )}
      </section>

      <ConfigDetailDialog
        config={selectedConfig}
        open={selectedConfig !== null}
        onClose={() => setSelectedConfig(null)}
      />

      <UpdateConfigDialog
        config={updateConfig}
        open={updateConfig !== null}
        onClose={() => setUpdateConfig(null)}
        onSuccess={() => refetch()}
      />
    </div>
  )
}


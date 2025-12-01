import { XMarkIcon } from '@heroicons/react/24/outline'
import { useConfigByKey } from '@/api/features/config/config.queries'
import Loading from '@/components/Loading/Loading'
import type { TableConfigItem } from '../hooks/useConfigs'

type ConfigDetailDialogProps = {
  config: TableConfigItem | null
  open: boolean
  onClose: () => void
}

export default function ConfigDetailDialog({ config, open, onClose }: ConfigDetailDialogProps) {
  const { data, isLoading, error } = useConfigByKey(config?.config_key)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30" onClick={onClose} />
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Config Details
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loading size="lg" />
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Error loading config: {error.message}
                </p>
              </div>
            )}

            {data && !isLoading && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Config ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {data.config_id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Config Key
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                    {data.config_key}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Config Value
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono break-all">
                    {data.config_value}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


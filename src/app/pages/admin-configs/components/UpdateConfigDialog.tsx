import React, { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useUpdateConfigByKey } from '@/api/features/config/config.mutations'
import { useConfigByKey } from '@/api/features/config/config.queries'
import { useQueryClient } from '@tanstack/react-query'
import { useAlert } from '@/components/Alert/AlertProvider'
import Loading from '@/components/Loading/Loading'
import { qk } from '@/api/query/keys'
import type { TableConfigItem } from '../hooks/useConfigs'

type UpdateConfigDialogProps = {
  config: TableConfigItem | null
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function UpdateConfigDialog({ config, open, onClose, onSuccess }: UpdateConfigDialogProps) {
  const [configValue, setConfigValue] = useState<string>('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showAlert } = useAlert()

  const { data: currentConfig, isLoading: isLoadingConfig } = useConfigByKey(config?.config_key)
  const updateMutation = useUpdateConfigByKey(config?.config_key ?? '')

  useEffect(() => {
    if (currentConfig && open) {
      setConfigValue(currentConfig.config_value)
      setConfirmOpen(false)
    }
  }, [currentConfig, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!configValue.trim()) {
      showAlert({ type: 'error', heading: 'Validation Error', message: 'Config value cannot be empty.' })
      return
    }
    setConfirmOpen(true)
  }

  const handleConfirm = () => {
    if (!config?.config_key || !configValue.trim()) return

    updateMutation.mutate(
      { config_value: configValue.trim() },
      {
        onSuccess: () => {
          showAlert({ type: 'success', heading: 'Success', message: 'Config updated successfully.' })
          queryClient.invalidateQueries({ queryKey: qk.config.list() })
          queryClient.invalidateQueries({ queryKey: ['config', 'detail', config.config_key] })
          setConfirmOpen(false)
          onSuccess?.()
          onClose()
        },
        onError: (error) => {
          showAlert({
            type: 'error',
            heading: 'Update Failed',
            message: error.message || 'Failed to update config.',
          })
          setConfirmOpen(false)
        },
      },
    )
  }

  const handleCancel = () => {
    setConfirmOpen(false)
    if (currentConfig) {
      setConfigValue(currentConfig.config_value)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30" onClick={confirmOpen ? undefined : onClose} />
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {confirmOpen ? 'Confirm Update' : 'Update Config'}
            </h2>
            <button
              type="button"
              onClick={confirmOpen ? handleCancel : onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              disabled={updateMutation.isPending}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {isLoadingConfig && (
              <div className="flex items-center justify-center py-8">
                <Loading size="lg" />
              </div>
            )}

            {!isLoadingConfig && currentConfig && (
              <>
                {confirmOpen ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Are you sure you want to update this config?
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Config Key
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                        {currentConfig.config_key}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Old Value
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono break-all bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        {currentConfig.config_value}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        New Value
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono break-all bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        {configValue}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form id="update-config-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Config Key
                      </label>
                      <input
                        type="text"
                        value={currentConfig.config_key}
                        disabled
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Config Value <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={configValue}
                        onChange={(e) => setConfigValue(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter config value"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Config value must be at least 1 character.
                      </p>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            {confirmOpen ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updateMutation.isPending && <Loading size="sm" />}
                  {updateMutation.isPending ? 'Updating...' : 'Confirm Update'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="update-config-form"
                  disabled={updateMutation.isPending || !configValue.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


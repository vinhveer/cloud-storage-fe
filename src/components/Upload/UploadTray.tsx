import { useAppSelector, useAppDispatch } from '@/state/store'
import { removeTask, clearCompleted } from '@/state/uploads/uploads.slice'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function UploadTray() {
    const tasks = useAppSelector(s => s.uploads.tasks)
    const dispatch = useAppDispatch()
    const completed = tasks.filter(t => t.status === 'success' || t.status === 'error')
    if (tasks.length === 0) return null

    return (
        <div className="fixed bottom-4 right-4 z-[9999] w-80 space-y-3">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Uploads</span>
                    <div className="flex items-center gap-2">
                        {completed.length > 0 && (
                            <button
                                onClick={() => dispatch(clearCompleted())}
                                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Clear done
                            </button>
                        )}
                    </div>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks.map(t => (
                        <div key={t.id} className="px-3 py-2 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <div className="truncate text-sm text-gray-800 dark:text-gray-100" title={t.fileName}>{t.fileName}</div>
                                <button
                                    onClick={() => dispatch(removeTask({ id: t.id }))}
                                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                    aria-label="Remove"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={
                                        'h-full transition-all ' +
                                        (t.status === 'error'
                                            ? 'bg-red-500'
                                            : t.status === 'success'
                                                ? 'bg-green-500'
                                                : 'bg-blue-500')
                                    }
                                    style={{ width: `${t.progress}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 dark:text-gray-400">
                                    {t.status === 'pending' && 'Đang chờ'}
                                    {t.status === 'uploading' && `${t.progress}%`}
                                    {t.status === 'success' && 'Hoàn tất'}
                                    {t.status === 'error' && 'Lỗi'}
                                </span>
                                <span className="text-gray-400 dark:text-gray-500">
                                    {t.status === 'success' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
                                    {t.status === 'error' && <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

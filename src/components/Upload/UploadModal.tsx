import React from 'react'
import FormUpload from '@/components/FormGroup/FormUpload/FormUpload'
import { useAppDispatch } from '@/state/store'
import { startUploads, updateProgressByFile, markSuccessByFile, markErrorByFile } from '@/state/uploads/uploads.slice'
import { toFormData } from '@/api/core/upload'
import { upload } from '@/api/core/fetcher'

interface UploadModalProps {
    open: boolean
    onClose: () => void
    folderId?: number | null
}

export default function UploadModal({ open, onClose, folderId = null }: UploadModalProps) {
    const dispatch = useAppDispatch()
    const [files, setFiles] = React.useState<File[]>([])
    const [starting, setStarting] = React.useState(false)

    if (!open) return null

    const beginUpload = async () => {
        if (files.length === 0) return
        setStarting(true)
        // Add tasks to store
        dispatch(startUploads(files, folderId))
        // After dispatch we cannot directly get ids; re-map by file name+size is unreliable.
        // We'll create a local map (file index -> task id) by recreating tasks here.
        // NOTE: Hiện tại slice dùng nanoid nên không lấy trực tiếp id ở đây.

        for (const f of files) {
            try {
                await upload('/api/files', toFormData({ file: f, folder_id: folderId ?? undefined } as any), {
                    onProgress: percent => {
                        dispatch(updateProgressByFile({ fileName: f.name, size: f.size, progress: percent }))
                    },
                })
                dispatch(markSuccessByFile({ fileName: f.name, size: f.size }))
            } catch (e: any) {
                dispatch(markErrorByFile({ fileName: f.name, size: f.size, error: e?.message || 'Upload failed' }))
            }
        }

        setStarting(false)
        onClose()
    }

    // Helper action creators using file identity
    // Đã dùng action creators thực trong slice, bỏ helper tạm

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 mx-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upload files</h2>
                <FormUpload multiple files={files} onFilesChange={setFiles} label="Chọn hoặc kéo thả tệp" />
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        disabled={files.length === 0 || starting}
                        onClick={beginUpload}
                        className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {starting && <span className="animate-spin h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full" />}
                        Tải lên ({files.length})
                    </button>
                </div>
            </div>
        </div>
    )
}

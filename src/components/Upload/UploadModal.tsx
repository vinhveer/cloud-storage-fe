import React from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { Button } from '@/components/Button/Button'
import FormUpload from '@/components/FormGroup/FormUpload/FormUpload'
import { useAppDispatch } from '@/state/store'
import { startUploads, updateProgressByFile, markSuccessByFile, markErrorByFile } from '@/state/uploads/uploads.slice'
import { toFormData } from '@/api/core/upload'
import { upload } from '@/api/core/fetcher'
import { useQueryClient } from '@tanstack/react-query'
import { qk } from '@/api/query/keys'

interface UploadModalProps {
    open: boolean
    onClose: () => void
    folderId?: number | null
}

export default function UploadModal({ open, onClose, folderId = null }: UploadModalProps) {
    const dispatch = useAppDispatch()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const location = useLocation()
    const [files, setFiles] = React.useState<File[]>([])
    const [starting, setStarting] = React.useState(false)

    if (!open) return null

    const handleClose = () => {
        // Clear selected files when closing modal so next open starts clean
        setFiles([])
        onClose()
    }

    const beginUpload = async () => {
        if (files.length === 0) return
        setStarting(true)
        
        // Determine target folder ID
        // If on my-files page and has folderId, use it; otherwise use root (null)
        const isMyFilesPage = location.pathname === '/my-files'
        const targetFolderId = isMyFilesPage && folderId ? folderId : null
        
        // Add tasks to store
        dispatch(startUploads(files, targetFolderId))
        // After dispatch we cannot directly get ids; re-map by file name+size is unreliable.
        // We'll create a local map (file index -> task id) by recreating tasks here.
        // NOTE: Hiện tại slice dùng nanoid nên không lấy trực tiếp id ở đây.

        for (const f of files) {
            try {
                await upload('/api/files', toFormData({ file: f, folder_id: targetFolderId ?? undefined } as any), {
                    onProgress: percent => {
                        dispatch(updateProgressByFile({ fileName: f.name, size: f.size, progress: percent }))
                    },
                })
                dispatch(markSuccessByFile({ fileName: f.name, size: f.size }))
            } catch (e: any) {
                dispatch(markErrorByFile({ fileName: f.name, size: f.size, error: e?.message || 'Upload failed' }))
            }
        }

        // Invalidate queries to refresh file list
        await queryClient.invalidateQueries({
            queryKey: qk.folders.contents(targetFolderId ?? 'root')
        })

        setStarting(false)
        handleClose()
        
        // If not on my-files page, navigate to my-files root after upload
        if (!isMyFilesPage) {
            navigate({ to: '/my-files' })
        }
    }

    // Helper action creators using file identity
    // Đã dùng action creators thực trong slice, bỏ helper tạm

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={handleClose} />
            <div className="relative w-full max-w-lg max-h-[80vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg flex flex-col mx-4">
                <div className="p-6 pb-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upload files</h2>
                </div>
                <div className="px-6 pb-3 flex-1 min-h-0 overflow-y-auto">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select or drag and drop files
                    </p>
                    <FormUpload multiple files={files} onFilesChange={setFiles} hideLabel />
                </div>
                <div className="px-6 pt-3 pb-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        disabled={files.length === 0 || starting}
                        onClick={beginUpload}
                        isLoading={starting}
                        loadingText={`Uploading... (${files.length})`}
                    >
                        Upload ({files.length})
                    </Button>
                </div>
            </div>
        </div>
    )
}

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
import { useAlert } from '@/components/Alert/AlertProvider'

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
    const { showAlert } = useAlert()
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
        
        // Get current folder contents to check for duplicates
        const contentsQueryKey = qk.folders.contents(targetFolderId ?? 'root')
        const contentsData = queryClient.getQueryData(contentsQueryKey) as { files?: Array<{ file_id: number; display_name: string }> } | undefined
        const existingFiles = contentsData?.files ?? []
        
        // Add tasks to store
        dispatch(startUploads(files, targetFolderId))

        for (const f of files) {
            try {
                const fileNameLower = f.name.toLowerCase()
                const existingFile = existingFiles.find(ef => ef.display_name.toLowerCase() === fileNameLower)
                
                if (existingFile) {
                    // File exists, upload as new version
                    dispatch(updateProgressByFile({ fileName: f.name, size: f.size, progress: 0 }))
                    const formData = toFormData({ action: 'update', notes: 'Updated via upload', file: f } as any)
                    await upload(`/api/files/${existingFile.file_id}/versions`, formData, {
                        onProgress: percent => {
                            dispatch(updateProgressByFile({ fileName: f.name, size: f.size, progress: percent }))
                        },
                    })
                    dispatch(markSuccessByFile({ fileName: f.name, size: f.size }))
                    showAlert({ type: 'success', heading: 'File Updated', message: `File "${f.name}" has been updated with a new version.` })
                } else {
                    // New file, upload normally
                    await upload('/api/files', toFormData({ file: f, folder_id: targetFolderId ?? undefined } as any), {
                        onProgress: percent => {
                            dispatch(updateProgressByFile({ fileName: f.name, size: f.size, progress: percent }))
                        },
                    })
                    dispatch(markSuccessByFile({ fileName: f.name, size: f.size }))
                }
            } catch (e: any) {
                dispatch(markErrorByFile({ fileName: f.name, size: f.size, error: e?.message || 'Upload failed' }))
                showAlert({ type: 'error', heading: 'Upload Failed', message: `Failed to upload "${f.name}": ${e?.message || 'Unknown error'}` })
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

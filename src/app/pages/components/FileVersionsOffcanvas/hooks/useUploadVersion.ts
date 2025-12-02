import { useState, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAlert } from '@/components/Alert/AlertProvider'

export function useUploadVersion(fileId: number | null) {
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadAction, setUploadAction] = useState('update')
  const [uploadNotes, setUploadNotes] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const queryClient = useQueryClient()
  const { showAlert } = useAlert()

  const handleUpload = useCallback(async () => {
    if (!fileId || !uploadFile) return

    setUploadProgress(0)

    try {
      const { toFormData } = await import('@/api/core/upload')
      const { upload } = await import('@/api/core/fetcher')

      const formData = toFormData({
        action: uploadAction,
        notes: uploadNotes || undefined,
        file: uploadFile,
      })

      await upload(`/api/files/${fileId}/versions`, formData, {
        onProgress: (percent) => {
          setUploadProgress(percent)
        },
      })

      setUploadProgress(100)
      showAlert({ type: 'success', message: 'Version uploaded successfully.' })
      queryClient.invalidateQueries({ queryKey: ['file-versions', fileId] })
      setShowUploadForm(false)
      setUploadFile(null)
      setUploadAction('update')
      setUploadNotes('')
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error: any) {
      showAlert({
        type: 'error',
        message: error.message || 'Failed to upload version. Please try again.',
      })
      setUploadProgress(0)
    }
  }, [fileId, uploadFile, uploadAction, uploadNotes, showAlert, queryClient])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFile(file)
    }
  }, [])

  const resetUploadForm = useCallback(() => {
    setShowUploadForm(false)
    setUploadFile(null)
    setUploadAction('update')
    setUploadNotes('')
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return {
    showUploadForm,
    setShowUploadForm,
    uploadAction,
    setUploadAction,
    uploadNotes,
    setUploadNotes,
    uploadFile,
    uploadProgress,
    fileInputRef,
    handleUpload,
    handleFileChange,
    resetUploadForm,
  }
}


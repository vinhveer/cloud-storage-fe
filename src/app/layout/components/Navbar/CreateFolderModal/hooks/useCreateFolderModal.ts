import { useState } from 'react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useCreateFolder } from '@/api/features/folder/folder.mutations'

export type UseCreateFolderModalProps = {
  currentFolderId?: number | null
  onSuccess?: () => void
}

export function useCreateFolderModal({ currentFolderId = null, onSuccess }: UseCreateFolderModalProps) {
  const [newFolderName, setNewFolderName] = useState('')
  const createFolderMutation = useCreateFolder()
  const navigate = useNavigate()
  const location = useLocation()

  const handleCreate = () => {
    const name = newFolderName.trim()
    if (!name) return
    
    // Determine target folder ID
    // If on my-files page and has folderId, use it; otherwise use root (null)
    const isMyFilesPage = location.pathname === '/my-files'
    const targetFolderId = isMyFilesPage && currentFolderId ? currentFolderId : null
    
    createFolderMutation.mutate(
      { folder_name: name, parent_folder_id: targetFolderId ?? undefined },
      {
        onSuccess: () => {
          setNewFolderName('')
          onSuccess?.()
          
          // If not on my-files page, navigate to my-files root after creation
          if (!isMyFilesPage) {
            navigate({ to: '/my-files' })
          }
        },
      },
    )
  }

  const reset = () => {
    setNewFolderName('')
  }

  return {
    newFolderName,
    setNewFolderName,
    createFolderMutation,
    handleCreate,
    reset,
  }
}


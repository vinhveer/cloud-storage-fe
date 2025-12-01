import { useState, useEffect } from 'react'
import { useUpdateFolder } from '@/api/features/folder/folder.mutations'
import type { FileItem } from '@/components/FileList/types'

export function useFolderDetailPanel(folder: FileItem | null) {
  const [name, setName] = useState(folder?.name ?? '')
  const updateFolderMutation = useUpdateFolder()

  useEffect(() => {
    setName(folder?.name ?? '')
  }, [folder?.name])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !folder?.id) return

    await updateFolderMutation.mutateAsync({
      folderId: Number(folder.id),
      folder_name: name.trim(),
    })
  }

  return {
    name,
    setName,
    updateFolderMutation,
    handleSubmit,
  }
}


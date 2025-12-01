import { useMemo } from 'react'
import { DocumentIcon, PhotoIcon, FilmIcon, MusicalNoteIcon, FolderIcon } from '@heroicons/react/24/outline'
import type { FileItem } from '@/components/FileList/types'

export function useFileDetailPanel(file: FileItem | null) {
  const isFolder = (file?.type ?? '').toLowerCase() === 'folder'

  const ItemIcon = useMemo(() => {
    if (isFolder) return FolderIcon
    const name = file?.name?.toLowerCase() ?? ''
    if (name.match(/\.(png|jpe?g|gif|webp|bmp|svg)$/)) return PhotoIcon
    if (name.match(/\.(mp4|mov|avi|mkv|webm)$/)) return FilmIcon
    if (name.match(/\.(mp3|wav|flac|aac)$/)) return MusicalNoteIcon
    return DocumentIcon
  }, [file?.name, isFolder])

  return {
    isFolder,
    ItemIcon,
  }
}


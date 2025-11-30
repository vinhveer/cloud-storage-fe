import { useState, useRef, useEffect } from 'react'

export function useUploadButton() {
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const uploadButtonRef = useRef<HTMLDivElement | null>(null)
  const uploadMenuRef = useRef<HTMLDivElement | null>(null)

  // Outside click / escape handling for upload menu
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!uploadMenuOpen) return
      if (
        uploadMenuRef.current &&
        !uploadMenuRef.current.contains(e.target as Node) &&
        uploadButtonRef.current &&
        !uploadButtonRef.current.contains(e.target as Node)
      ) {
        setUploadMenuOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setUploadMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [uploadMenuOpen])

  return {
    uploadMenuOpen,
    setUploadMenuOpen,
    uploadModalOpen,
    setUploadModalOpen,
    createFolderOpen,
    setCreateFolderOpen,
    uploadButtonRef,
    uploadMenuRef,
  }
}


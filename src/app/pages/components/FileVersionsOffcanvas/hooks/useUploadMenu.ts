import { useState, useEffect, useRef } from 'react'

export function useUploadMenu() {
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false)
  const uploadButtonRef = useRef<HTMLDivElement | null>(null)
  const uploadMenuRef = useRef<HTMLDivElement | null>(null)

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
    uploadButtonRef,
    uploadMenuRef,
  }
}


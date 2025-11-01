import React from 'react'

export function useFormUpload(onFilesChange?: (files: File[]) => void) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dtFiles = Array.from(e.dataTransfer.files ?? [])
    if (dtFiles.length > 0) onFilesChange?.(dtFiles)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    onFilesChange?.(files)
  }

  const openPicker = () => inputRef.current?.click()

  return { isDragging, inputRef, handleDragOver, handleDragLeave, handleDrop, handleChange, openPicker }
}



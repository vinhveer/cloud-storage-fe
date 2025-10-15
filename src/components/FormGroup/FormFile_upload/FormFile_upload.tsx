import React from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export type FormFileUploadProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  required?: boolean
  error?: string | null
  help?: string | null
  accept?: string
  multiple?: boolean
  onFilesChange?: (files: File[]) => void
}

export default function FormFileUpload({
  label,
  required = false,
  error,
  help,
  accept = '*',
  multiple = false,
  className,
  onFilesChange,
  id,
  ...rest
}: FormFileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const reactId = React.useId()
  const helpId = `${id ?? reactId}-help`
  const errorId = `${id ?? reactId}-error`

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
    if (dtFiles.length > 0) {
      onFilesChange?.(dtFiles)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    onFilesChange?.(files)
  }

  const borderStateClass = isDragging ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'

  return (
    <div className={clsx('not-prose space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 dark:text-red-400">*</span>}
        </label>
      )}

      <div
        className={clsx(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
          borderStateClass
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        aria-describedby={error ? errorId : help ? helpId : undefined}
        aria-invalid={!!error}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          required={required}
          className="sr-only"
          onChange={handleChange}
          {...rest}
        />

        <div className="space-y-2 pointer-events-none">
          <div className="flex justify-center">
            <ArrowUpTrayIcon className="text-gray-400 dark:text-gray-500 w-8 h-8" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 cursor-pointer">Click to upload</span>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {accept !== '*' ? accept.replace('*', 'any') : 'Any file type'}
              {multiple && ' (multiple files allowed)'}
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : help ? (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">{help}</p>
      ) : null}
    </div>
  )
}



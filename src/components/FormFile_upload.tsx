import React from 'react'
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

export default function FormFile_upload({
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

  const borderStateClass = isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'

  return (
    <div className={clsx('not-prose space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          {...rest}
        />

        <div className="space-y-2 pointer-events-none">
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-gray-400 w-8 h-8"
              aria-hidden="true"
            >
              <path d="M7 18a4 4 0 0 1 0-8c.197 0 .39.017.577.049A6 6 0 0 1 20 11a3 3 0 0 1 0 6H7zm5-9.586V16a1 1 0 1 1-2 0V8.414L8.707 9.707a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 1 1-1.414 1.414L12 8.414z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">Click to upload</span>
              {' '}or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept !== '*' ? accept.replace('*', 'any') : 'Any file type'}
              {multiple && ' (multiple files allowed)'}
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-red-600">{error}</p>
      ) : help ? (
        <p id={helpId} className="text-sm text-gray-500">{help}</p>
      ) : null}
    </div>
  )
}



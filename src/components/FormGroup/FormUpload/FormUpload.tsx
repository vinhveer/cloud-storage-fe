import React from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import type { FormUploadProps } from '@/components/FormGroup/FormUpload/types'
import { useFormUpload } from '@/components/FormGroup/FormUpload/formupload.hook'

export default function FormUpload({
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
}: FormUploadProps) {
  const { isDragging, inputRef, handleDragOver, handleDragLeave, handleDrop, handleChange, openPicker } = useFormUpload(onFilesChange)
  const reactId = React.useId()
  const helpId = `${id ?? reactId}-help`
  const errorId = `${id ?? reactId}-error`

  const borderStateClass = isDragging ? 'formupload-dropzone-drag' : 'formupload-dropzone-idle'

  return (
    <div className={clsx('formupload-root', className)}>
      {label && (
        <label className="formupload-label">
          {label}
          {required && <span className="formupload-required">*</span>}
        </label>
      )}

      <div
        className={clsx('formupload-dropzone', borderStateClass)}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openPicker}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openPicker()
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
          <div className="formupload-iconwrap">
            <ArrowUpTrayIcon className="formupload-icon" aria-hidden="true" />
          </div>
          <div>
            <p className="formupload-hint">
              <span className="formupload-hint-action">Click to upload</span>
              {' '}or drag and drop
            </p>
            <p className="formupload-subhint">
              {accept !== '*' ? accept.replace('*', 'any') : 'Any file type'}
              {multiple && ' (multiple files allowed)'}
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <p id={errorId} className="formupload-error-text">{error}</p>
      ) : help ? (
        <p id={helpId} className="formupload-help-text">{help}</p>
      ) : null}
    </div>
  )
}



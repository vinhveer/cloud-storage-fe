import React from 'react'
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
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
  files,
  id,
  ...rest
}: FormUploadProps) {
  const [internalFiles, setInternalFiles] = React.useState<File[]>([])
  const filesView = files ?? internalFiles

  const handleFilesSelected = React.useCallback(
    (picked: File[]) => {
      const next = multiple ? [...filesView, ...picked] : picked.slice(0, 1)
      setInternalFiles(next)
      onFilesChange?.(next)
    },
    [filesView, multiple, onFilesChange]
  )

  const { isDragging, inputRef, handleDragOver, handleDragLeave, handleDrop, handleChange, openPicker } =
    useFormUpload(handleFilesSelected)
  const reactId = React.useId()
  const helpId = `${id ?? reactId}-help`
  const errorId = `${id ?? reactId}-error`

  const borderStateClass = isDragging ? 'formupload-dropzone-drag' : 'formupload-dropzone-idle'
  let describedById: string | undefined
  if (error) {
    describedById = errorId
  } else if (help) {
    describedById = helpId
  }

  const getExtension = (name: string) => {
    const parts = name.split('.')
    if (parts.length < 2) return ''
    return parts.pop()!.toLowerCase()
  }

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`
    const kb = size / 1024
    if (kb < 1024) return `${Math.round(kb)} KB`
    const mb = kb / 1024
    if (mb < 1024) return `${mb.toFixed(1)} MB`
    const gb = mb / 1024
    return `${gb.toFixed(2)} GB`
  }

  const getExtStyle = (ext: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      pdf: { bg: 'bg-red-100', text: 'text-red-700' },
      doc: { bg: 'bg-blue-100', text: 'text-blue-700' },
      docx: { bg: 'bg-blue-100', text: 'text-blue-700' },
      xls: { bg: 'bg-green-100', text: 'text-green-700' },
      xlsx: { bg: 'bg-green-100', text: 'text-green-700' },
      ppt: { bg: 'bg-orange-100', text: 'text-orange-700' },
      pptx: { bg: 'bg-orange-100', text: 'text-orange-700' },
      jpg: { bg: 'bg-pink-100', text: 'text-pink-700' },
      jpeg: { bg: 'bg-pink-100', text: 'text-pink-700' },
      png: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
      gif: { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
      svg: { bg: 'bg-violet-100', text: 'text-violet-700' },
      zip: { bg: 'bg-zinc-100', text: 'text-zinc-700' },
      rar: { bg: 'bg-zinc-100', text: 'text-zinc-700' },
      txt: { bg: 'bg-gray-100', text: 'text-gray-700' },
      csv: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      mp3: { bg: 'bg-amber-100', text: 'text-amber-700' },
      mp4: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      mov: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      avi: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
      json: { bg: 'bg-slate-100', text: 'text-slate-700' },
      xml: { bg: 'bg-slate-100', text: 'text-slate-700' },
      html: { bg: 'bg-rose-100', text: 'text-rose-700' }
    }
    return map[ext] ?? { bg: 'bg-gray-100', text: 'text-gray-700' }
  }

  const removeAt = (idx: number) => {
    const next = filesView.filter((_, i) => i !== idx)
    setInternalFiles(next)
    onFilesChange?.(next)
  }

  return (
    <div className={clsx('formupload-root w-full', className)}>
      {label && (
        <label className="formupload-label">
          {label}
          {required && <span className="formupload-required">*</span>}
        </label>
      )}

      <button
        type="button"
        className={clsx('formupload-dropzone w-full', borderStateClass)}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openPicker}
        aria-describedby={describedById}
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
              <span className="formupload-hint-action">Click to upload</span>{' '}or drag and drop
            </p>
            <p className="formupload-subhint">
              {accept === '*' ? 'Any file type' : accept.replace('*', 'any')}
              {multiple && ' (multiple files allowed)'}
            </p>
          </div>
        </div>
      </button>

      {filesView.length > 0 && (
        <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filesView.map((f, idx) => {
            const ext = getExtension(f.name)
            const style = getExtStyle(ext)
            return (
              <div key={`${f.name}-${idx}`} className="rounded-md border border-gray-200 bg-white p-3 flex items-center gap-3">
                <div className={clsx('flex items-center justify-center rounded-md w-12 h-12 font-semibold', style.bg, style.text)}>
                  {ext ? ext.toUpperCase() : 'FILE'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-gray-900">{f.name}</div>
                  <div className="text-xs text-gray-500">{formatSize(f.size)}</div>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${f.name}`}
                  className="shrink-0 rounded p-1 hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                  onClick={() => removeAt(idx)}
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {error && (
        <p id={errorId} className="formupload-error-text">{error}</p>
      )}
      {!error && help && (
        <p id={helpId} className="formupload-help-text">{help}</p>
      )}
    </div>
  )
}



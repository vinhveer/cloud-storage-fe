import React from 'react'
import clsx from 'clsx'
import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'

export type FormUploadProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  required?: boolean
  error?: string | null
  help?: string | null
  accept?: string
  multiple?: boolean
  onFilesChange?: (files: File[]) => void
}

type FileWithPreview = File & { preview?: string }

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
  const [isDragging, setIsDragging] = React.useState(false)
  const [filesState, setFilesState] = React.useState<FileWithPreview[]>([])
  const filesRef = React.useRef<FileWithPreview[]>([])
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const [highlight, setHighlight] = React.useState(false)
  const reactId = React.useId()
  const helpId = `${id ?? reactId}-help`
  const errorId = `${id ?? reactId}-error`
  const field = React.useContext(FormFieldContext)

  React.useEffect(() => {
    filesRef.current = filesState
  }, [filesState])

  React.useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview)
      })
    }
  }, [])
  //
  // Listen for global "form-upload-open" event so external buttons can trigger
  // this FormUpload's file dialog and bring the UI into view. Event is cancelable:
  // handler calls preventDefault() to indicate it handled the opening.
  React.useEffect(() => {
    let highlightTimer: number | undefined
    const handler = (ev: Event) => {
      try {
        const ce = ev as CustomEvent<{ targetId?: string }>
        const detail = ce.detail ?? {}
        if (detail.targetId && detail.targetId !== id) return
        // mark handled so sender doesn't open their own file input
        ev.preventDefault()

        // bring the upload UI into view and focus it
        if (containerRef.current) {
          ;(containerRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
          // focus to enable keyboard access
          ;(containerRef.current as HTMLElement).focus()
          // briefly highlight the component so user sees the UI
          setHighlight(true)
          window.clearTimeout(highlightTimer)
          // @ts-ignore timer id
          highlightTimer = window.setTimeout(() => setHighlight(false), 2200)
        }

        // finally open the file picker
        inputRef.current?.click()
      } catch {
        // ignore
      }
    }

    window.addEventListener('form-upload-open', handler as EventListener)
    return () => {
      window.removeEventListener('form-upload-open', handler as EventListener)
      if (highlightTimer) window.clearTimeout(highlightTimer)
    }
  }, [id])

  // If the page was navigated to with ?openUpload=1, open this FormUpload.
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('openUpload') === '1') {
        const target = params.get('targetId')
        if (target && id && target !== id) return
        // bring into view and open
        if (containerRef.current) {
          ;(containerRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
          ;(containerRef.current as HTMLElement).focus()
          setHighlight(true)
          window.setTimeout(() => setHighlight(false), 2200)
        }
        inputRef.current?.click()

        // remove query params so reloading doesn't re-open
        const url = new URL(window.location.href)
        url.searchParams.delete('openUpload')
        url.searchParams.delete('targetId')
        window.history.replaceState({}, document.title, url.toString())
      }
    } catch {
      // ignore
    }
  }, [id])

  const pushFiles = (newFiles: File[]) => {
    const processed = newFiles.map((f) => {
      const fw = f as FileWithPreview
      if (f.type.startsWith('image/')) fw.preview = URL.createObjectURL(f)
      return fw
    })

    setFilesState((prev) => {
      const next = multiple ? [...prev, ...processed] : processed
      filesRef.current = next
      onFilesChange?.(next.map((x) => x as File))
      return next
    })
  }

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
    if (dtFiles.length > 0) pushFiles(dtFiles)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    pushFiles(files)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeFileAt = (index: number) => {
    setFilesState((prev) => {
      const removed = prev[index]
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      const next = prev.filter((_, i) => i !== index)
      filesRef.current = next
      onFilesChange?.(next.map((x) => x as File))
      return next
    })
  }

  const clearAll = () => {
    filesRef.current.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview)
    })
    filesRef.current = []
    setFilesState([])
    onFilesChange?.([])
  }

  const borderStateClass = isDragging
    ? 'border-gray-400 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30'
    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-white dark:bg-transparent'

  return (
    <div className={clsx('not-prose space-y-2', className)}>
      {label && (
        <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
          <span className="block">{label}{required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}</span>
          {filesState.length > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearAll() }}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear ({filesState.length})
            </button>
          )}
        </label>
      )}

      <div
        ref={containerRef}
        className={clsx(
          'relative border-2 border-dashed rounded-lg p-4 transition-colors duration-200 outline-none',
          borderStateClass,
          highlight && 'ring-2 ring-blue-300 dark:ring-blue-500'
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
        aria-describedby={error ? errorId : help ? helpId : field?.describedById}
        aria-invalid={field?.invalid || !!error}
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

        <div className="flex items-center gap-4 pointer-events-none">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <ArrowUpTrayIcon className="text-gray-400 dark:text-gray-500 w-6 h-6" aria-hidden="true" />
            </div>
          </div>

          <div className="text-left pointer-events-none flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {accept !== '*' ? accept.replace('*', 'any') : 'Any file type'}
              {multiple && ' — multiple files allowed'}
            </p>
          </div>
        </div>

        {filesState.length > 0 && (
          <div className="mt-4 pointer-events-auto">
            <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {filesState.map((f, idx) => (
                <li key={`${f.name}-${f.size}-${idx}`} className="flex items-center gap-3 p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-transparent">
                  {f.preview ? (
                    <img src={f.preview} alt={f.name} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-600">
                      {f.name.split('.').pop()?.toUpperCase() ?? 'FILE'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{f.name}</div>
                    <div className="text-xs text-gray-500 truncate">{Math.round(f.size / 1024)} KB</div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFileAt(idx) }}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label={`Remove ${f.name}`}
                    >
                      <TrashIcon className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : help ? (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">{help}</p>
      ) : null}
    </div>
  )
}



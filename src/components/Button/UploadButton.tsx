import React from 'react'
import { Button } from '@/components/Button/Button'

type NativeButtonBase = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'>
type ButtonLikeProps = {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  icon?: React.ReactNode
  value?: string
  isLoading?: boolean
  loadingText?: string
}

export type UploadButtonProps = NativeButtonBase & ButtonLikeProps & {
  accept?: string
  multiple?: boolean
  onFilesSelected?: (files: File[]) => void
  /** Optional id of a FormUpload to target. If provided, UploadButton will dispatch an event with this targetId */
  targetId?: string
  /** Optional href to navigate to when no FormUpload handled the open event. Query param `openUpload=1` and `targetId` will be appended. */
  targetHref?: string
}

export type UploadButtonHandle = {
  open: () => void
}

export const UploadButton = React.forwardRef<UploadButtonHandle, UploadButtonProps>(
  ({ accept = '*', multiple = false, onFilesSelected, onClick, targetId, targetHref, ...buttonProps }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    const open = React.useCallback(() => {
      inputRef.current?.click()
    }, [])

    React.useImperativeHandle(ref, () => ({ open }), [open])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      if (!e.defaultPrevented) {
        // Dispatch a cancelable global event so a nearby FormUpload can open
  const ev = new CustomEvent('form-upload-open', { cancelable: true, detail: { accept, multiple, targetId } })
        window.dispatchEvent(ev)
        // If no FormUpload handled the event (didn't call preventDefault):
        if (!ev.defaultPrevented) {
          if (targetHref) {
            const sep = targetHref.includes('?') ? '&' : '?'
            const params = `openUpload=1${targetId ? `&targetId=${encodeURIComponent(targetId)}` : ''}`
            window.location.assign(`${targetHref}${sep}${params}`)
            return
          }
          open()
        }
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? [])
      onFilesSelected?.(files)
      // allow re-selecting the same file by resetting value
      e.target.value = ''
    }

    return (
      <>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          tabIndex={-1}
        />
        <Button {...buttonProps} onClick={handleClick} />
      </>
    )
  }
)

UploadButton.displayName = 'UploadButton'

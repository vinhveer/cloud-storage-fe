import type React from 'react'
import type { FormTextareaProps } from '@/components/FormGroup/FormTextarea/types'
import { useFormTextarea } from '@/components/FormGroup/FormTextarea/form-textarea.hook'
import { Editor } from '@tinymce/tinymce-react'
import 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/themes/silver'
import 'tinymce/models/dom'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/table'
import 'tinymce/plugins/code'
import 'tinymce/plugins/autoresize'
import 'tinymce/skins/ui/oxide/skin.min.css'

export default function FormTextarea({
  placeholder = '',
  rows = 4,
  className,
  id,
  children,
  rich,
  height,
  onValueChange,
  editorInit,
  ...rest
}: FormTextareaProps) {
  const { textareaId, textareaClasses, ariaInvalid, ariaDescribedBy } = useFormTextarea({
    id,
    className,
    rich,
  })

  if (rich) {
    let editorHeight: number
    if (typeof height === 'number') {
      editorHeight = height
    } else {
      editorHeight = Math.max(200, rows * 24 + 24)
    }
    const defaultInit = {
      menubar: false,
      branding: false,
      statusbar: false,
      plugins: 'link lists table code autoresize',
      toolbar: 'undo redo | bold italic underline | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | link removeformat | code',
      content_style: 'body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; font-size: 14px; }',
      height: editorHeight,
      // Self-hosted OSS license declaration to suppress cloud key warning
      license_key: 'gpl',
      licenseKey: 'gpl',
      // Prevent TinyMCE from trying to load skins via URL (we imported CSS above)
      skin: false,
      content_css: false,
    } as Record<string, unknown>

    const value = (rest as unknown as { value?: unknown }).value as string | undefined
    const defaultValue = (rest as unknown as { defaultValue?: unknown }).defaultValue as string | undefined
    const onChange = (rest as unknown as { onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }).onChange

    return (
      <div className={textareaClasses} aria-invalid={ariaInvalid} aria-describedby={ariaDescribedBy}>
        <Editor
          id={textareaId}
          value={value}
          initialValue={defaultValue}
          onEditorChange={(content) => {
            if (typeof onValueChange === 'function') onValueChange(content)
            if (typeof onChange === 'function') {
              onChange({ target: { value: content } } as unknown as React.ChangeEvent<HTMLTextAreaElement>)
            }
          }}
          init={editorInit ? { ...defaultInit, ...editorInit } : defaultInit}
        />
      </div>
    )
  }

  return (
    <textarea
      id={textareaId}
      rows={rows}
      placeholder={placeholder}
      className={textareaClasses}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      {...rest}
    >{children}</textarea>
  )
}



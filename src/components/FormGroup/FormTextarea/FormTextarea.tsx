import React from 'react'
import clsx from 'clsx'
import { FormFieldContext } from '@/components/FormGroup/FormGroup'
import type { FormTextareaProps } from '@/components/FormGroup/FormTextarea/types'
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
  const reactId = React.useId()
  const textareaId = id ?? `txt-${reactId}`
  const field = React.useContext(FormFieldContext)

  const baseClasses = 'formtextarea-base'
  const errorClasses = 'formtextarea-error'
  const normalClasses = 'formtextarea-normal'
 
  const stateClass = field?.invalid ? errorClasses : normalClasses
  const textareaClasses = rich
    ? clsx(
        // Remove borders and spacing entirely when using rich editor
        'p-0 border-0',
        className,
      )
    : clsx(
        baseClasses,
        stateClass,
        className,
      )

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
      <div className={textareaClasses} aria-invalid={field?.invalid} aria-describedby={field?.describedById}>
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
      aria-invalid={field?.invalid}
      aria-describedby={field?.describedById}
      {...rest}
    >{children}</textarea>
  )
}



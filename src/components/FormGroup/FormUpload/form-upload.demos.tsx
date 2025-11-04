import React from 'react'
import FormUpload from '@/components/FormGroup/FormUpload/FormUpload'

export function FormUploadBasicDemo() {
  const [files, setFiles] = React.useState<File[]>([])
  return (
    <div className="grid gap-3">
  <FormUpload id="page-upload" label="Tải lên tệp" onFilesChange={setFiles} />
      <ul className="text-sm text-gray-600 list-disc pl-5">
        {files.map((f) => (
          <li key={f.name}>{f.name} ({Math.round(f.size / 1024)} KB)</li>
        ))}
      </ul>
    </div>
  )
}

export function FormUploadAcceptDemo() {
  const [, setFiles] = React.useState<File[]>([])
  return (
    <div className="grid gap-3">
      <FormUpload label="Chỉ ảnh" accept="image/*" onFilesChange={setFiles} />
      <div className="text-xs text-gray-500">Chỉ nhận ảnh (image/*)</div>
    </div>
  )
}

export function FormUploadMultipleDemo() {
  const [files, setFiles] = React.useState<File[]>([])
  return (
    <div className="grid gap-3">
      <FormUpload label="Nhiều tệp" multiple onFilesChange={setFiles} />
      <div className="text-xs text-gray-500">Có thể kéo thả nhiều tệp cùng lúc.</div>
      <ul className="text-sm text-gray-600 list-disc pl-5">
        {files.map((f) => (
          <li key={f.name}>{f.name}</li>
        ))}
      </ul>
    </div>
  )
}



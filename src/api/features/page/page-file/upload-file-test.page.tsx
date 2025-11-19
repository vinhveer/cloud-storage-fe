import React from 'react'
import { useUploadFile } from '@/api/features/file/file.mutations'

export default function UploadFileTestPage() {
  const [folderId, setFolderId] = React.useState<string>('')
  const [file, setFile] = React.useState<File | null>(null)
  const uploadMutation = useUploadFile()

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const selected = event.target.files?.[0] ?? null
    setFile(selected)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (!file) {
      alert('Please choose a file first')
      return
    }

    uploadMutation.mutate({
      file,
      folderId: folderId === '' ? undefined : Number(folderId),
    })
  }

  const runQuickTest = (mode: 'root' | 'folder-ok' | 'folder-not-found') => {
    if (!file) {
      alert('Please choose a file first')
      return
    }

    if (mode === 'root') {
      uploadMutation.mutate({
        file,
      })
      return
    }

    if (mode === 'folder-ok') {
      uploadMutation.mutate({
        file,
        folderId: 29,
      })
      return
    }

    uploadMutation.mutate({
      file,
      folderId: 999999,
    })
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Upload File Test</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 400,
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <label>
          File:
          <input type="file" onChange={handleFileChange} />
        </label>
        <label>
          Folder ID (optional):
          <input
            type="number"
            value={folderId}
            onChange={event => setFolderId(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={uploadMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: uploadMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: uploadMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => runQuickTest('root')}
          disabled={uploadMutation.isPending}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            cursor: uploadMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: '#16a34a',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Quick test: root (201)
        </button>
        <button
          type="button"
          onClick={() => runQuickTest('folder-ok')}
          disabled={uploadMutation.isPending}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            cursor: uploadMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: '#f97316',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Quick test: folder 29 (201)
        </button>
        <button
          type="button"
          onClick={() => runQuickTest('folder-not-found')}
          disabled={uploadMutation.isPending}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            cursor: uploadMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Quick test: folder 999999 (404)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {uploadMutation.isError && (
          <pre
            style={{
              marginTop: 8,
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#fef2f2',
              color: '#b91c1c',
              fontSize: 12,
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(uploadMutation.error, null, 2)}
          </pre>
        )}
        {uploadMutation.isSuccess && (
          <pre
            style={{
              marginTop: 8,
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#ecfdf3',
              color: '#166534',
              fontSize: 12,
              overflowX: 'auto',
            }}
          >
            {JSON.stringify(uploadMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



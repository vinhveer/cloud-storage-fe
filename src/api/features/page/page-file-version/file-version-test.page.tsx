import React from 'react'
import { useUploadFileVersion } from '@/api/features/file-version/file-version.mutations'

export default function FileVersionTestPage() {
  const [fileId, setFileId] = React.useState<string>('')
  const [action, setAction] = React.useState<string>('')
  const [notes, setNotes] = React.useState<string>('')
  const [file, setFile] = React.useState<File | null>(null)
  const mutation = useUploadFileVersion()

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const selected = event.target.files?.[0] ?? null
    setFile(selected)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    const numericId = Number(fileId)
    if (Number.isNaN(numericId)) {
      alert('File ID must be a number')
      return
    }

    if (action.trim() === '') {
      alert('Action is required')
      return
    }

    if (!file) {
      alert('Please choose a file first')
      return
    }

    mutation.mutate({
      fileId: numericId,
      action,
      notes: notes === '' ? undefined : notes,
      file,
    })
  }

  const runQuick = (mode: 'happy' | 'missing-file' | 'forbidden' | 'not-found') => {
    if (mode === 'happy') {
      setFileId('51')
      setAction('update')
      setNotes('Updated chapter 3')
      return
    }

    if (mode === 'missing-file') {
      setFileId('12')
      setAction('upload')
      setNotes('')
      setFile(null)
      return
    }

    if (mode === 'forbidden') {
      setFileId('16')
      setAction('upload')
      setNotes('')
      return
    }

    setFileId('999999')
    setAction('upload')
    setNotes('')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>File Version Upload Test</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 480,
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <label>
          File ID:
          <input
            type="number"
            value={fileId}
            onChange={event => setFileId(event.target.value)}
          />
        </label>
        <label>
          Action:
          <input
            type="text"
            value={action}
            onChange={event => setAction(event.target.value)}
          />
        </label>
        <label>
          Notes (optional):
          <input
            type="text"
            value={notes}
            onChange={event => setNotes(event.target.value)}
          />
        </label>
        <label>
          File:
          <input
            type="file"
            onChange={handleFileChange}
          />
        </label>
        <button
          type="submit"
          disabled={mutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: mutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: mutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {mutation.isPending ? 'Uploading...' : 'Upload version'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('happy')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#16a34a',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: happy path (201)
        </button>
        <button
          type="button"
          onClick={() => runQuick('missing-file')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#facc15',
            color: '#1f2937',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: missing file (422)
        </button>
        <button
          type="button"
          onClick={() => runQuick('forbidden')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#f97316',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: forbidden (403)
        </button>
        <button
          type="button"
          onClick={() => runQuick('not-found')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: not found (404)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {mutation.isError && (
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
            {JSON.stringify(mutation.error, null, 2)}
          </pre>
        )}
        {mutation.isSuccess && (
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
            {JSON.stringify(mutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



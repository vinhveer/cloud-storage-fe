import React from 'react'
import { useDeleteFile } from '@/api/features/file/file.mutations'

export default function FileDeleteTestPage() {
  const [fileId, setFileId] = React.useState<string>('45')
  const deleteMutation = useDeleteFile()

  const numericId = fileId === '' ? undefined : Number(fileId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericId === undefined || Number.isNaN(numericId)) {
      alert('File id must be a number')
      return
    }

    deleteMutation.mutate(numericId)
  }

  const runQuick = (mode: 'happy' | 'not-found' | 'forbidden') => {
    if (mode === 'happy') {
      setFileId('45')
      return
    }

    if (mode === 'not-found') {
      setFileId('999999')
      return
    }

    setFileId('18')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>File Delete Test</h1>
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
          File ID:
          <input
            type="number"
            value={fileId}
            onChange={event => setFileId(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={deleteMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: deleteMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: deleteMutation.isPending ? '#9ca3af' : '#dc2626',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete file'}
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
          Quick: delete my file (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('not-found')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#0ea5e9',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: 999999 (404)
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
          Quick: 18 (403)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {deleteMutation.isError && (
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
            {JSON.stringify(deleteMutation.error, null, 2)}
          </pre>
        )}
        {deleteMutation.isSuccess && (
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
            {JSON.stringify(deleteMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



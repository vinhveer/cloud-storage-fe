import React from 'react'
import { useMoveFile } from '@/api/features/file/file.mutations'

export default function MoveFileTestPage() {
  const [fileId, setFileId] = React.useState<string>('47')
  const [destinationFolderId, setDestinationFolderId] = React.useState<string>('29')
  const moveMutation = useMoveFile()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (!fileId) {
      alert('Please enter file id')
      return
    }

    moveMutation.mutate({
      fileId: Number(fileId),
      destinationFolderId: destinationFolderId === '' ? undefined : Number(destinationFolderId),
    })
  }

  const runQuickTest = (mode: 'to-folder' | 'to-root' | 'folder-not-found' | 'file-not-found') => {
    if (!fileId) {
      alert('Please enter file id')
      return
    }

    const id = Number(fileId)

    if (Number.isNaN(id)) {
      alert('File id must be a number')
      return
    }

    if (mode === 'to-folder') {
      moveMutation.mutate({
        fileId: id,
        destinationFolderId: 29,
      })
      return
    }

    if (mode === 'to-root') {
      moveMutation.mutate({
        fileId: id,
      })
      return
    }

    if (mode === 'file-not-found') {
      moveMutation.mutate({
        fileId: 999999,
        destinationFolderId: 3,
      })
      return
    }

    moveMutation.mutate({
      fileId: id,
      destinationFolderId: 999999,
    })
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Move File Test</h1>
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
        <label>
          Destination Folder ID (optional):
          <input
            type="number"
            value={destinationFolderId}
            onChange={event => setDestinationFolderId(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={moveMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: moveMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: moveMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {moveMutation.isPending ? 'Moving...' : 'Move file'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuickTest('to-folder')}
          disabled={moveMutation.isPending}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            cursor: moveMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: '#16a34a',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Quick: to folder 29 (200)
        </button>
        <button
          type="button"
          onClick={() => runQuickTest('to-root')}
          disabled={moveMutation.isPending}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            cursor: moveMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: '#0ea5e9',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Quick: to root (200)
        </button>
        <button
          type="button"
          onClick={() => runQuickTest('folder-not-found')}
          disabled={moveMutation.isPending}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            cursor: moveMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: '#f97316',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Quick: folder 999999 (404)
        </button>
        <button
          type="button"
          onClick={() => runQuickTest('file-not-found')}
          disabled={moveMutation.isPending}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            cursor: moveMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Quick: file 999999 (404)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {moveMutation.isError && (
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
            {JSON.stringify(moveMutation.error, null, 2)}
          </pre>
        )}
        {moveMutation.isSuccess && (
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
            {JSON.stringify(moveMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



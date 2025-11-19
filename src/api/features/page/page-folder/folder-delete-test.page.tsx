import React from 'react'
import { useDeleteFolder } from '@/api/features/folder/folder.mutations'

export default function FolderDeleteTestPage() {
  const [folderId, setFolderId] = React.useState<string>('')
  const deleteFolderMutation = useDeleteFolder()

  const numericFolderId = folderId === '' ? undefined : Number(folderId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericFolderId === undefined || Number.isNaN(numericFolderId) || numericFolderId <= 0) {
      alert('Folder ID must be a positive number')
      return
    }

    deleteFolderMutation.mutate(numericFolderId)
  }

  const runQuick = (mode: 'happy' | 'not-found' | 'forbidden' | 'unauth') => {
    if (mode === 'happy') {
      setFolderId('29')
      return
    }

    if (mode === 'not-found') {
      setFolderId('999999')
      return
    }

    if (mode === 'forbidden') {
      setFolderId('1')
      return
    }

    setFolderId('29')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Folder Delete Test</h1>
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
          Folder ID:
          <input
            type="number"
            value={folderId}
            onChange={event => setFolderId(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={deleteFolderMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: deleteFolderMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: deleteFolderMutation.isPending ? '#9ca3af' : '#dc2626',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {deleteFolderMutation.isPending ? 'Deleting...' : 'Delete folder'}
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
          Quick: delete owned folder (200)
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
          Quick: not my folder (403)
        </button>
        <button
          type="button"
          onClick={() => runQuick('unauth')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#eab308',
            color: '#1f2937',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: unauth (401)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {deleteFolderMutation.isError && (
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
            {JSON.stringify(deleteFolderMutation.error, null, 2)}
          </pre>
        )}
        {deleteFolderMutation.isSuccess && (
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
            {JSON.stringify(deleteFolderMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



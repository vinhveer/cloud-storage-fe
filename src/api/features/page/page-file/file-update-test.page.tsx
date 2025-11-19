import React from 'react'
import { useUpdateFile } from '@/api/features/file/file.mutations'

export default function FileUpdateTestPage() {
  const [fileId, setFileId] = React.useState<string>('45')
  const [displayName, setDisplayName] = React.useState<string>('updated_report.txt')
  const [folderId, setFolderId] = React.useState<string>('')
  const updateMutation = useUpdateFile()

  const numericId = fileId === '' ? undefined : Number(fileId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericId === undefined || Number.isNaN(numericId)) {
      alert('File id must be a number')
      return
    }

    updateMutation.mutate({
      fileId: numericId,
      displayName: displayName === '' ? undefined : displayName,
      folderId: folderId === '' ? undefined : Number(folderId),
    })
  }

  const runQuick = (mode: 'happy' | 'missing' | 'invalid-folder' | 'not-found' | 'forbidden') => {
    if (mode === 'happy') {
      setFileId('45')
      setDisplayName('updated_report.txt')
      setFolderId('')
      return
    }

    if (mode === 'missing') {
      setFileId('4')
      setDisplayName('')
      setFolderId('')
      return
    }

    if (mode === 'invalid-folder') {
      setFileId('4')
      setDisplayName('')
      setFolderId('-5')
      return
    }

    if (mode === 'not-found') {
      setFileId('999999')
      setDisplayName('nope.pdf')
      setFolderId('')
      return
    }

    setFileId('18')
    setDisplayName('forbidden_change.pdf')
    setFolderId('')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>File Update Test</h1>
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
          Display name:
          <input
            type="text"
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
          />
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
          disabled={updateMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: updateMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: updateMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {updateMutation.isPending ? 'Updating...' : 'Update file'}
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
          Quick: 45 rename (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('missing')}
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
          Quick: missing fields (422)
        </button>
        <button
          type="button"
          onClick={() => runQuick('invalid-folder')}
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
          Quick: folder_id=-5 (422)
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
            backgroundColor: '#dc2626',
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
        {updateMutation.isError && (
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
            {JSON.stringify(updateMutation.error, null, 2)}
          </pre>
        )}
        {updateMutation.isSuccess && (
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
            {JSON.stringify(updateMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



import React from 'react'
import { useCopyFile } from '@/api/features/file/file.mutations'

export default function FileCopyTestPage() {
  const [fileId, setFileId] = React.useState<string>('46')
  const [destinationFolderId, setDestinationFolderId] = React.useState<string>('') // empty = null
  const [onlyLatest, setOnlyLatest] = React.useState<boolean>(false)
  const copyMutation = useCopyFile()

  const numericId = fileId === '' ? undefined : Number(fileId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericId === undefined || Number.isNaN(numericId)) {
      alert('File id must be a number')
      return
    }

    copyMutation.mutate({
      fileId: numericId,
      destinationFolderId: destinationFolderId === '' ? null : Number(destinationFolderId),
      onlyLatest,
    })
  }

  const runQuick = (mode: 'all' | 'only-latest-query' | 'only-latest-body' | 'not-found' | 'forbidden') => {
    if (mode === 'all') {
      setFileId('46')
      setDestinationFolderId('')
      setOnlyLatest(false)
      return
    }

    if (mode === 'only-latest-query' || mode === 'only-latest-body') {
      setFileId('46')
      setDestinationFolderId('')
      setOnlyLatest(true)
      return
    }

    if (mode === 'not-found') {
      setFileId('999999')
      setDestinationFolderId('2')
      setOnlyLatest(false)
      return
    }

    setFileId('35')
    setDestinationFolderId('1')
    setOnlyLatest(false)
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>File Copy Test</h1>
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
          Destination Folder ID (empty = null):
          <input
            type="number"
            value={destinationFolderId}
            onChange={event => setDestinationFolderId(event.target.value)}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={onlyLatest}
            onChange={event => setOnlyLatest(event.target.checked)}
          />
          Only latest version
        </label>
        <button
          type="submit"
          disabled={copyMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: copyMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: copyMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {copyMutation.isPending ? 'Copying...' : 'Copy file'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('all')}
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
          Quick: all versions (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('only-latest-query')}
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
          Quick: only_latest=true (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('only-latest-body')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#6366f1',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: only_latest in body (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('not-found')}
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
          Quick: 35 (403)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {copyMutation.isError && (
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
            {JSON.stringify(copyMutation.error, null, 2)}
          </pre>
        )}
        {copyMutation.isSuccess && (
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
            {JSON.stringify(copyMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



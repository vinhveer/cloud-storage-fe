import React from 'react'
import { useRestoreFileVersion } from '@/api/features/file-version/file-version.mutations'

export default function FileVersionRestoreTestPage() {
  const [fileId, setFileId] = React.useState<string>('')
  const [versionId, setVersionId] = React.useState<string>('')

  const restoreMutation = useRestoreFileVersion()

  const numericFileId = fileId === '' ? undefined : Number(fileId)
  const numericVersionId = versionId === '' ? undefined : Number(versionId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericFileId === undefined || Number.isNaN(numericFileId) || numericVersionId === undefined || Number.isNaN(numericVersionId)) {
      alert('File ID and Version ID must be numbers')
      return
    }

    restoreMutation.mutate({
      fileId: numericFileId,
      versionId: numericVersionId,
    })
  }

  const runQuick = (mode: 'happy' | 'unauth' | 'forbidden' | 'file-not-found' | 'version-not-found') => {
    if (mode === 'happy') {
      setFileId('51')
      setVersionId('62')
      return
    }

    if (mode === 'unauth') {
      setFileId('123')
      setVersionId('3')
      return
    }

    if (mode === 'forbidden') {
      setFileId('16')
      setVersionId('29')
      return
    }

    if (mode === 'file-not-found') {
      setFileId('999999')
      setVersionId('3')
      return
    }

    setFileId('51')
    setVersionId('999999')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>File Version Restore Test</h1>
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
          Version ID:
          <input
            type="number"
            value={versionId}
            onChange={event => setVersionId(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={restoreMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: restoreMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: restoreMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {restoreMutation.isPending ? 'Restoring...' : 'Restore version'}
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
          onClick={() => runQuick('unauth')}
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
          Quick: unauth (401)
        </button>
        <button
          type="button"
          onClick={() => runQuick('forbidden')}
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
          Quick: forbidden (403)
        </button>
        <button
          type="button"
          onClick={() => runQuick('file-not-found')}
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
          Quick: file not found (404)
        </button>
        <button
          type="button"
          onClick={() => runQuick('version-not-found')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#a855f7',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: version not found (404)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {restoreMutation.isError && (
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
            {JSON.stringify(restoreMutation.error, null, 2)}
          </pre>
        )}
        {restoreMutation.isSuccess && (
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
            {JSON.stringify(restoreMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



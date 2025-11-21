import React from 'react'
import { useDeleteFileVersion } from '@/api/features/file/file.mutations'

export default function FileVersionDeleteTestPage() {
  const [fileId, setFileId] = React.useState<string>('51')
  const [versionId, setVersionId] = React.useState<string>('63')

  const mutation = useDeleteFileVersion()

  const runQuick = (mode: 'success' | 'unauthenticated' | 'forbidden' | 'file-not-found' | 'version-not-found') => {
    if (mode === 'success') {
      setFileId('51')
      setVersionId('63')
      return
    }
    if (mode === 'unauthenticated') {
      alert('Để test 401 Unauthenticated: vui lòng logout trước rồi bấm Delete.')
      setFileId('22')
      setVersionId('10')
      return
    }
    if (mode === 'forbidden') {
      setFileId('22')
      setVersionId('36')
      return
    }
    if (mode === 'file-not-found') {
      setFileId('999999')
      setVersionId('1')
      return
    }
    setFileId('51')
    setVersionId('999999')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Admin File Version Delete Test</h1>
      <form
        onSubmit={event => {
          event.preventDefault()
          const id = Number(fileId)
          const vid = Number(versionId)
          if (Number.isNaN(id) || Number.isNaN(vid)) {
            // eslint-disable-next-line no-alert
            alert('File ID và Version ID phải là số hợp lệ.')
            return
          }
          mutation.mutate({ fileId: id, versionId: vid })
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 360,
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
          disabled={mutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: mutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: mutation.isPending ? '#9ca3af' : '#dc2626',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {mutation.isPending ? 'Deleting...' : 'Delete version'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('success')}
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
          Quick: success (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('unauthenticated')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#6b7280',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: unauthenticated (401)
        </button>
        <button
          type="button"
          onClick={() => runQuick('forbidden')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#f59e0b',
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
            backgroundColor: '#0ea5e9',
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
            backgroundColor: '#dc2626',
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



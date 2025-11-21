import React from 'react'
import { useFileVersions } from '@/api/features/file-version/file-version.queries'

export default function FileVersionListTestPage() {
  const [fileId, setFileId] = React.useState<string>('')
  const [page, setPage] = React.useState<string>('1')
  const [perPage, setPerPage] = React.useState<string>('20')

  const numericFileId = Number(fileId)
  const numericPage = Number(page)
  const numericPerPage = Number(perPage)

  const query = useFileVersions({
    fileId: Number.isNaN(numericFileId) ? 0 : numericFileId,
    page: Number.isNaN(numericPage) ? undefined : numericPage,
    perPage: Number.isNaN(numericPerPage) ? undefined : numericPerPage,
  })

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()
    if (Number.isNaN(numericFileId) || numericFileId <= 0) {
      alert('File ID must be a positive number')
      return
    }
    query.refetch()
  }

  const runQuick = (mode: 'happy' | 'unauth' | 'not-found' | 'forbidden') => {
    if (mode === 'happy') {
      setFileId('51')
      setPage('1')
      setPerPage('20')
      return
    }

    if (mode === 'unauth') {
      setFileId('1')
      setPage('1')
      setPerPage('20')
      return
    }

    if (mode === 'not-found') {
      setFileId('999999')
      setPage('1')
      setPerPage('20')
      return
    }

    setFileId('2')
    setPage('1')
    setPerPage('20')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>File Version List Test</h1>
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
          Page:
          <input
            type="number"
            value={page}
            onChange={event => setPage(event.target.value)}
          />
        </label>
        <label>
          Per page:
          <input
            type="number"
            value={perPage}
            onChange={event => setPerPage(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={query.isLoading}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: query.isLoading ? 'not-allowed' : 'pointer',
            backgroundColor: query.isLoading ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {query.isLoading ? 'Loading...' : 'Fetch versions'}
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
          Quick: happy path (200)
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
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {query.isError && (
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
            {JSON.stringify(query.error, null, 2)}
          </pre>
        )}
        {query.isSuccess && (
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
            {JSON.stringify(query.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



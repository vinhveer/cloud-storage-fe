import React from 'react'
import { useFilePreview } from '@/api/features/file/file.queries'

export default function FilePreviewTestPage() {
  const [fileId, setFileId] = React.useState<string>('50')

  const numericId = fileId === '' ? undefined : Number(fileId)
  const query = useFilePreview(Number.isNaN(numericId as number) ? undefined : numericId)

  const runQuick = (mode: 'pdf' | 'txt' | 'not-allowed') => {
    if (mode === 'pdf') {
      setFileId('50')
      return
    }
    if (mode === 'txt') {
      setFileId('55')
      return
    }
    setFileId('10')
  }

  const previewUrl =
    query.isSuccess && query.data.preview_url ? query.data.preview_url : undefined

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>File Preview Test</h1>
      <form
        onSubmit={event => {
          event.preventDefault()
          query.refetch()
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
        <button
          type="submit"
          disabled={query.isFetching}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: query.isFetching ? 'not-allowed' : 'pointer',
            backgroundColor: query.isFetching ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {query.isFetching ? 'Loading...' : 'Fetch preview'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('pdf')}
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
          Quick: PDF (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('txt')}
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
          Quick: TXT (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('not-allowed')}
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

        {previewUrl && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#e0f2fe',
              color: '#1d4ed8',
              fontSize: 12,
            }}
          >
            <p>Preview URL:</p>
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              Open preview in new tab
            </a>
          </div>
        )}
      </div>
    </div>
  )
}



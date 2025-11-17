import React from 'react'
import { useDownloadFile } from '@/api/features/file/file.mutations'

export default function FileDownloadTestPage() {
  const [fileId, setFileId] = React.useState<string>('46')
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null)
  const downloadMutation = useDownloadFile()

  const numericId = fileId === '' ? undefined : Number(fileId)

  const handleDownload = (id: number) => {
    if (Number.isNaN(id)) {
      alert('File id must be a number')
      return
    }

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }

    downloadMutation.mutate(id, {
      onSuccess: blob => {
        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)
      },
    })
  }

  const runQuick = (mode: 'happy' | 'not-found' | 'forbidden') => {
    if (mode === 'happy') {
      setFileId('46')
      if (numericId !== undefined) {
        handleDownload(46)
      }
      return
    }
    if (mode === 'not-found') {
      setFileId('999999')
      handleDownload(999999)
      return
    }
    setFileId('18')
    handleDownload(18)
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>File Download Test</h1>
      <form
        onSubmit={event => {
          event.preventDefault()
          if (numericId === undefined || Number.isNaN(numericId)) {
            alert('File id must be a number')
            return
          }
          handleDownload(numericId)
        }}
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
          disabled={downloadMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: downloadMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: downloadMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {downloadMutation.isPending ? 'Downloading...' : 'Download file'}
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
          Quick: 46 (200)
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
          Quick: 18 (403)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {downloadMutation.isError && (
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
            {JSON.stringify(downloadMutation.error, null, 2)}
          </pre>
        )}
        {downloadUrl && (
          <div
            style={{
              marginTop: 8,
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#ecfdf3',
              color: '#166534',
              fontSize: 12,
            }}
          >
            <p>Download ready:</p>
            <a
              href={downloadUrl}
              download={`file-${fileId}`}
              style={{ color: '#2563eb', textDecoration: 'underline' }}
            >
              Click here to save file-{fileId}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}



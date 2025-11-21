import React from 'react'
import { useDownloadFileVersion } from '@/api/features/file-version/file-version.mutations.download'

export default function FileVersionDownloadTestPage() {
  const [fileId, setFileId] = React.useState<string>('')
  const [versionId, setVersionId] = React.useState<string>('')
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null)

  const downloadMutation = useDownloadFileVersion()

  const numericFileId = fileId === '' ? undefined : Number(fileId)
  const numericVersionId = versionId === '' ? undefined : Number(versionId)

  const handleDownload = (fId: number, vId: number) => {
    if (Number.isNaN(fId) || Number.isNaN(vId)) {
      alert('File ID and Version ID must be numbers')
      return
    }

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }

    downloadMutation.mutate(
      {
        fileId: fId,
        versionId: vId,
      },
      {
        onSuccess: blob => {
          const url = URL.createObjectURL(blob)
          setDownloadUrl(url)
        },
      },
    )
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()
    if (numericFileId === undefined || Number.isNaN(numericFileId) || numericVersionId === undefined || Number.isNaN(numericVersionId)) {
      alert('File ID and Version ID must be numbers')
      return
    }
    handleDownload(numericFileId, numericVersionId)
  }

  const runQuick = (mode: 'happy' | 'unauth' | 'version-not-found' | 'forbidden') => {
    if (mode === 'happy') {
      setFileId('51')
      setVersionId('63')
      handleDownload(51, 63)
      return
    }

    if (mode === 'unauth') {
      setFileId('123')
      setVersionId('3')
      handleDownload(123, 3)
      return
    }

    if (mode === 'version-not-found') {
      setFileId('51')
      setVersionId('999999')
      handleDownload(51, 999999)
      return
    }

    setFileId('6')
    setVersionId('16')
    handleDownload(6, 16)
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>File Version Download Test</h1>
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
          Version ID:
          <input
            type="number"
            value={versionId}
            onChange={event => setVersionId(event.target.value)}
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
          {downloadMutation.isPending ? 'Downloading...' : 'Download version'}
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
              download={`file-${fileId}-version-${versionId}`}
              style={{ color: '#2563eb', textDecoration: 'underline' }}
            >
              Click here to save file-{fileId}-version-{versionId}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}



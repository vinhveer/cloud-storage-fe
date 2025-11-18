import React from 'react'
import { useBulkCopy } from '@/api/features/bulk/bulk.mutations'

export default function BulkCopyTestPage() {
  const [fileIds, setFileIds] = React.useState<string>('')
  const [folderIds, setFolderIds] = React.useState<string>('')
  const [destinationFolderId, setDestinationFolderId] = React.useState<string>('') // empty = null
  const bulkCopyMutation = useBulkCopy()

  const parseIds = (value: string) =>
    value
      .split(',')
      .map(v => v.trim())
      .filter(Boolean)
      .map(v => Number.parseInt(v, 10))
      .filter(v => !Number.isNaN(v))

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    const files = parseIds(fileIds)
    const folders = parseIds(folderIds)

    bulkCopyMutation.mutate({
      file_ids: files.length ? files : undefined,
      folder_ids: folders.length ? folders : undefined,
      destination_folder_id: destinationFolderId === '' ? null : Number(destinationFolderId),
    })
  }

  const runQuick = (mode: 'happy' | 'unauth' | 'copy-failed') => {
    if (mode === 'happy') {
      setFileIds('')
      setFolderIds('')
      setDestinationFolderId('')
      return
    }

    if (mode === 'unauth') {
      setFileIds('5')
      setFolderIds('')
      setDestinationFolderId('')
      return
    }

    setFileIds('5')
    setFolderIds('')
    setDestinationFolderId('1')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Bulk Copy Test</h1>
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
          File IDs (comma separated):
          <input
            type="text"
            value={fileIds}
            onChange={event => setFileIds(event.target.value)}
          />
        </label>
        <label>
          Folder IDs (comma separated):
          <input
            type="text"
            value={folderIds}
            onChange={event => setFolderIds(event.target.value)}
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
        <button
          type="submit"
          disabled={bulkCopyMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: bulkCopyMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: bulkCopyMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {bulkCopyMutation.isPending ? 'Copying...' : 'Run bulk copy'}
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
          onClick={() => runQuick('copy-failed')}
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
          Quick: COPY_FAILED (400)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {bulkCopyMutation.isError && (
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
            {JSON.stringify(bulkCopyMutation.error, null, 2)}
          </pre>
        )}
        {bulkCopyMutation.isSuccess && (
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
            {JSON.stringify(bulkCopyMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



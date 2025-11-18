import React from 'react'
import { useBulkMove } from '@/api/features/bulk/bulk.mutations'

export default function BulkMoveTestPage() {
  const [fileIds, setFileIds] = React.useState<string>('')
  const [folderIds, setFolderIds] = React.useState<string>('')
  const [destinationFolderId, setDestinationFolderId] = React.useState<string>('')
  const bulkMoveMutation = useBulkMove()

  const parseIds = (value: string) =>
    value
      .split(',')
      .map(v => v.trim())
      .filter(Boolean)
      .map(v => Number.parseInt(v, 10))
      .filter(v => !Number.isNaN(v))

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (destinationFolderId === '' || Number.isNaN(Number(destinationFolderId))) {
      alert('Destination folder id is required and must be a number')
      return
    }

    const files = parseIds(fileIds)
    const folders = parseIds(folderIds)

    bulkMoveMutation.mutate({
      file_ids: files.length ? files : undefined,
      folder_ids: folders.length ? folders : undefined,
      destination_folder_id: Number(destinationFolderId),
    })
  }

  const runQuick = (mode: 'happy' | 'unauth' | 'dest-error' | 'none-moved') => {
    if (mode === 'happy') {
      setFileIds('52,53')
      setFolderIds('35')
      setDestinationFolderId('34')
      return
    }

    if (mode === 'unauth') {
      setFileIds('10,11')
      setFolderIds('4')
      setDestinationFolderId('8')
      return
    }

    if (mode === 'dest-error') {
      setFileIds('10')
      setFolderIds('')
      setDestinationFolderId('1')
      return
    }

    setFileIds('999999')
    setFolderIds('888888')
    setDestinationFolderId('34')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Bulk Move Test</h1>
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
          Destination Folder ID:
          <input
            type="number"
            value={destinationFolderId}
            onChange={event => setDestinationFolderId(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={bulkMoveMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: bulkMoveMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: bulkMoveMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {bulkMoveMutation.isPending ? 'Moving...' : 'Run bulk move'}
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
          onClick={() => runQuick('dest-error')}
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
          Quick: DESTINATION_ERROR (400)
        </button>
        <button
          type="button"
          onClick={() => runQuick('none-moved')}
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
          Quick: none moved (400)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {bulkMoveMutation.isError && (
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
            {JSON.stringify(bulkMoveMutation.error, null, 2)}
          </pre>
        )}
        {bulkMoveMutation.isSuccess && (
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
            {JSON.stringify(bulkMoveMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



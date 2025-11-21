import React from 'react'
import { useBulkDelete } from '@/api/features/bulk/bulk.mutations'

export default function BulkDeleteTestPage() {
  const [fileIds, setFileIds] = React.useState<string>('')
  const [folderIds, setFolderIds] = React.useState<string>('')
  const bulkDeleteMutation = useBulkDelete()

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

    bulkDeleteMutation.mutate({
      file_ids: files.length ? files : undefined,
      folder_ids: folders.length ? folders : undefined,
    })
  }

  const runQuick = (mode: 'happy' | 'no-payload' | 'unauth') => {
    if (mode === 'happy') {
      setFileIds('53')
      setFolderIds('34')
      return
    }

    if (mode === 'no-payload') {
      setFileIds('')
      setFolderIds('')
      return
    }

    setFileIds('1')
    setFolderIds('')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Bulk Delete Test</h1>
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
        <button
          type="submit"
          disabled={bulkDeleteMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: bulkDeleteMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: bulkDeleteMutation.isPending ? '#9ca3af' : '#dc2626',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {bulkDeleteMutation.isPending ? 'Deleting...' : 'Run bulk delete'}
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
          onClick={() => runQuick('no-payload')}
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
          Quick: no payload (422)
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
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {bulkDeleteMutation.isError && (
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
            {JSON.stringify(bulkDeleteMutation.error, null, 2)}
          </pre>
        )}
        {bulkDeleteMutation.isSuccess && (
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
            {JSON.stringify(bulkDeleteMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



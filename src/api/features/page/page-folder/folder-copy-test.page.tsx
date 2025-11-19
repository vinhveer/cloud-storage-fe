import React from 'react'
import { useCopyFolder } from '@/api/features/folder/folder.mutations'

export default function FolderCopyTestPage() {
  const [folderId, setFolderId] = React.useState<string>('')
  const [targetFolderId, setTargetFolderId] = React.useState<string>('')

  const copyFolderMutation = useCopyFolder()

  const numericFolderId = folderId === '' ? undefined : Number(folderId)
  const numericTargetFolderId =
    targetFolderId === '' ? null : Number.isNaN(Number(targetFolderId)) ? null : Number(targetFolderId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericFolderId === undefined || Number.isNaN(numericFolderId) || numericFolderId <= 0) {
      alert('Folder ID must be a positive number')
      return
    }

    copyFolderMutation.mutate({
      folderId: numericFolderId,
      target_folder_id: numericTargetFolderId,
    })
  }

  const runQuick = (mode: 'happy' | 'validation' | 'forbidden' | 'unauth') => {
    if (mode === 'happy') {
      setFolderId('29')
      setTargetFolderId('')
      return
    }

    if (mode === 'validation') {
      // This will be caught by backend validation if it rejects null / invalid combos,
      // or by frontend if you change the schema later.
      setFolderId('1')
      setTargetFolderId('not-an-int')
      return
    }

    if (mode === 'forbidden') {
      setFolderId('1')
      setTargetFolderId('2')
      return
    }

    setFolderId('1')
    setTargetFolderId('2')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Folder Copy Test</h1>
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
          Source folder ID (id):
          <input
            type="number"
            value={folderId}
            onChange={event => setFolderId(event.target.value)}
          />
        </label>
        <label>
          Target folder ID (target_folder_id, optional):
          <input
            type="text"
            value={targetFolderId}
            onChange={event => setTargetFolderId(event.target.value)}
            placeholder="Empty = null (root)"
          />
        </label>
        <button
          type="submit"
          disabled={copyFolderMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: copyFolderMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: copyFolderMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {copyFolderMutation.isPending ? 'Copying...' : 'Copy folder'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {/* 200 */}
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
          Quick: copy id=29 to root (200)
        </button>
        {/* 422 validation example (backend or frontend) */}
        <button
          type="button"
          onClick={() => runQuick('validation')}
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
          Quick: target_folder_id = "not-an-int" (422)
        </button>
        {/* 403 */}
        <button
          type="button"
          onClick={() => runQuick('forbidden')}
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
          Quick: forbidden (403)
        </button>
        {/* 401 */}
        <button
          type="button"
          onClick={() => runQuick('unauth')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#eab308',
            color: '#1f2937',
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
        {copyFolderMutation.isError && (
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
            {JSON.stringify(copyFolderMutation.error, null, 2)}
          </pre>
        )}
        {copyFolderMutation.isSuccess && (
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
            {JSON.stringify(copyFolderMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



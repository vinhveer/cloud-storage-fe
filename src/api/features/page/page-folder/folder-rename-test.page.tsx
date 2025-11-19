import React from 'react'
import { useUpdateFolder } from '@/api/features/folder/folder.mutations'

export default function FolderRenameTestPage() {
  const [folderId, setFolderId] = React.useState<string>('')
  const [folderName, setFolderName] = React.useState<string>('')

  const updateFolderMutation = useUpdateFolder()

  const numericFolderId = folderId === '' ? undefined : Number(folderId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericFolderId === undefined || Number.isNaN(numericFolderId) || numericFolderId <= 0) {
      alert('Folder ID must be a positive number')
      return
    }

    if (folderName.trim() === '') {
      alert('Folder name is required')
      return
    }

    updateFolderMutation.mutate({
      folderId: numericFolderId,
      folder_name: folderName,
    })
  }

  const runQuick = (mode: 'happy' | 'missing-name' | 'not-found' | 'unauth') => {
    if (mode === 'happy') {
      setFolderId('29')
      setFolderName('Đồ án mới')
      return
    }

    if (mode === 'missing-name') {
      setFolderId('29')
      setFolderName('')
      return
    }

    if (mode === 'not-found') {
      setFolderId('999999')
      setFolderName('New name')
      return
    }

    setFolderId('29')
    setFolderName('Đồ án mới (unauth)')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Folder Rename Test</h1>
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
          Folder ID:
          <input
            type="number"
            value={folderId}
            onChange={event => setFolderId(event.target.value)}
          />
        </label>
        <label>
          New folder name:
          <input
            type="text"
            value={folderName}
            onChange={event => setFolderName(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={updateFolderMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: updateFolderMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: updateFolderMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {updateFolderMutation.isPending ? 'Renaming...' : 'Rename folder'}
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
          onClick={() => runQuick('missing-name')}
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
          Quick: missing name (422)
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
        {updateFolderMutation.isError && (
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
            {JSON.stringify(updateFolderMutation.error, null, 2)}
          </pre>
        )}
        {updateFolderMutation.isSuccess && (
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
            {JSON.stringify(updateFolderMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



import React from 'react'
import { useCreateFolder } from '@/api/features/folder/folder.mutations'

export default function CreateFolderTestPage() {
  const [folderName, setFolderName] = React.useState<string>('')
  const [parentFolderId, setParentFolderId] = React.useState<string>('')

  const createFolderMutation = useCreateFolder()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (folderName.trim() === '') {
      alert('Folder name is required')
      return
    }

    const payload: { folder_name: string; parent_folder_id?: number } = {
      folder_name: folderName,
    }

    if (parentFolderId !== '') {
      const numericParent = Number(parentFolderId)
      if (Number.isNaN(numericParent)) {
        alert('Parent folder id must be a number')
        return
      }
      payload.parent_folder_id = numericParent
    }

    createFolderMutation.mutate(payload)
  }

  const runQuick = (mode: 'root' | 'inside-parent' | 'missing-name' | 'invalid-parent' | 'unauth') => {
    if (mode === 'root') {
      setFolderName('Folder sẽ được move tới')
      setParentFolderId('')
      return
    }

    if (mode === 'inside-parent') {
      setFolderName('Bài tập')
      setParentFolderId('29')
      return
    }

    if (mode === 'missing-name') {
      setFolderName('')
      setParentFolderId('1')
      return
    }

    if (mode === 'invalid-parent') {
      setFolderName('Tài liệu học kỳ 2')
      setParentFolderId('1')
      return
    }

    setFolderName('Test unauth folder')
    setParentFolderId('')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Create Folder Test</h1>
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
          Folder name:
          <input
            type="text"
            value={folderName}
            onChange={event => setFolderName(event.target.value)}
          />
        </label>
        <label>
          Parent folder ID (optional):
          <input
            type="number"
            value={parentFolderId}
            onChange={event => setParentFolderId(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={createFolderMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: createFolderMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: createFolderMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {createFolderMutation.isPending ? 'Creating...' : 'Create folder'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('root')}
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
          Quick: create at root (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('inside-parent')}
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
          Quick: create inside parent (200)
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
          onClick={() => runQuick('invalid-parent')}
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
          Quick: invalid parent (500)
        </button>
        <button
          type="button"
          onClick={() => runQuick('unauth')}
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
          Quick: unauth (401)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {createFolderMutation.isError && (
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
            {JSON.stringify(createFolderMutation.error, null, 2)}
          </pre>
        )}
        {createFolderMutation.isSuccess && (
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
            {JSON.stringify(createFolderMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



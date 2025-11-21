import React from 'react'
import { useCreatePublicLink } from '@/api/features/public-link/public-link.mutations'

type ShareableType = 'file' | 'folder'
type PermissionType = 'view' | 'edit' | 'download'

export default function PublicLinkCreateTestPage() {
  const [shareableType, setShareableType] = React.useState<ShareableType>('folder')
  const [shareableId, setShareableId] = React.useState<string>('')
  const [permission, setPermission] = React.useState<PermissionType>('view')
  const [expiredAt, setExpiredAt] = React.useState<string>('')

  const createPublicLinkMutation = useCreatePublicLink()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (!shareableId || Number.isNaN(Number(shareableId)) || Number(shareableId) <= 0) {
      alert('shareable_id must be a positive number')
      return
    }

    if (!permission) {
      alert('permission is required')
      return
    }

    createPublicLinkMutation.mutate({
      shareable_type: shareableType,
      shareable_id: shareableId,
      permission,
      expired_at: expiredAt ? expiredAt : null,
    })
  }

  const runQuick = (mode: 'success-folder' | 'unauth' | 'invalid-permission' | 'folder-not-found' | 'forbidden') => {
    if (mode === 'success-folder') {
      setShareableType('folder')
      setShareableId('36')
      setPermission('view')
      setExpiredAt('')
      return
    }

    if (mode === 'unauth') {
      setShareableType('folder')
      setShareableId('36')
      setPermission('view')
      setExpiredAt('')
      return
    }

    if (mode === 'invalid-permission') {
      setShareableType('folder')
      setShareableId('36')
      // set invalid permission string to trigger 422 from backend
      setPermission('view')
      setExpiredAt('')
      return
    }

    if (mode === 'folder-not-found') {
      setShareableType('folder')
      setShareableId('9999999')
      setPermission('view')
      setExpiredAt('')
      return
    }

    // forbidden (file not owned by user)
    setShareableType('file')
    setShareableId('57')
    setPermission('view')
    setExpiredAt('')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Create Public Link Test</h1>
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
          Shareable type:
          <select
            value={shareableType}
            onChange={event => setShareableType(event.target.value as ShareableType)}
          >
            <option value="folder">folder</option>
            <option value="file">file</option>
          </select>
        </label>
        <label>
          Shareable ID (shareable_id):
          <input
            type="number"
            value={shareableId}
            onChange={event => setShareableId(event.target.value)}
          />
        </label>
        <label>
          Permission:
          <input
            type="text"
            value={permission}
            onChange={event => setPermission(event.target.value as PermissionType)}
            placeholder="e.g. view"
          />
        </label>
        <label>
          Expired at (ISO string, optional):
          <input
            type="text"
            value={expiredAt}
            onChange={event => setExpiredAt(event.target.value)}
            placeholder="2025-12-31T23:59:59+00:00 hoặc để trống = null"
          />
        </label>
        <button
          type="submit"
          disabled={createPublicLinkMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: createPublicLinkMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: createPublicLinkMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {createPublicLinkMutation.isPending ? 'Creating...' : 'Create public link'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('success-folder')}
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
          Quick: create public link for folder 36 (201)
        </button>
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
        <button
          type="button"
          onClick={() => runQuick('invalid-permission')}
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
          Quick: invalid permission (422)
        </button>
        <button
          type="button"
          onClick={() => runQuick('folder-not-found')}
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
          Quick: folder not found (404)
        </button>
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
          Quick: file not owned (403)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {createPublicLinkMutation.isError && (
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
            {JSON.stringify(createPublicLinkMutation.error, null, 2)}
          </pre>
        )}
        {createPublicLinkMutation.isSuccess && (
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
            {JSON.stringify(createPublicLinkMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



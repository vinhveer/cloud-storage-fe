import React from 'react'
import { useUpdatePublicLink } from '@/api/features/public-link/public-link.mutations'

export default function PublicLinkUpdateTestPage() {
  const [linkId, setLinkId] = React.useState<string>('')
  const [permission, setPermission] = React.useState<string>('download')
  const [expiredAt, setExpiredAt] = React.useState<string>('2025-12-31T23:59:59Z')

  const updateMutation = useUpdatePublicLink()

  const numericId = linkId === '' ? undefined : Number(linkId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericId === undefined || Number.isNaN(numericId) || numericId <= 0) {
      alert('Public link ID must be a positive number')
      return
    }

    updateMutation.mutate({
      id: numericId,
      permission: permission || undefined,
      expired_at: expiredAt ? expiredAt : undefined,
    })
  }

  const runQuick = (mode: 'success' | 'validation' | 'not-found') => {
    if (mode === 'success') {
      setLinkId('2')
      setPermission('download')
      setExpiredAt('2025-12-31T23:59:59Z')
      return
    }

    if (mode === 'validation') {
      setLinkId('2')
      setPermission('not_a_valid')
      setExpiredAt('not-a-date')
      return
    }

    setLinkId('9999999')
    setPermission('view')
    setExpiredAt('')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Public Link Update Test</h1>
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
          Public link ID:
          <input
            type="number"
            value={linkId}
            onChange={event => setLinkId(event.target.value)}
          />
        </label>
        <label>
          Permission:
          <input
            type="text"
            value={permission}
            onChange={event => setPermission(event.target.value)}
            placeholder="e.g. view, download"
          />
        </label>
        <label>
          Expired at (ISO string, optional):
          <input
            type="text"
            value={expiredAt}
            onChange={event => setExpiredAt(event.target.value)}
            placeholder="2025-12-31T23:59:59Z hoặc để trống"
          />
        </label>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: updateMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: updateMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {updateMutation.isPending ? 'Updating...' : 'Update public link'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('success')}
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
          Quick: id=2, permission=download (200)
        </button>
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
          Quick: invalid permission & date (422)
        </button>
        <button
          type="button"
          onClick={() => runQuick('not-found')}
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
          Quick: id=9999999 (404)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {updateMutation.isError && (
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
            {JSON.stringify(updateMutation.error, null, 2)}
          </pre>
        )}
        {updateMutation.isSuccess && (
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
            {JSON.stringify(updateMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



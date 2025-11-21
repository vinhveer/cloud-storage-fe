import React from 'react'
import { useRevokePublicLink } from '@/api/features/public-link/public-link.mutations'

export default function PublicLinkRevokeTestPage() {
  const [linkId, setLinkId] = React.useState<string>('')

  const revokeMutation = useRevokePublicLink()

  const numericId = linkId === '' ? undefined : Number(linkId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericId === undefined || Number.isNaN(numericId) || numericId <= 0) {
      alert('Public link ID must be a positive number')
      return
    }

    revokeMutation.mutate({
      id: numericId,
    })
  }

  const runQuick = (mode: 'success' | 'unauth') => {
    if (mode === 'success') {
      setLinkId('7')
      return
    }

    // unauth: người test mở tab chưa đăng nhập để nhận 401
    setLinkId('7')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Public Link Revoke Test</h1>
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
        <button
          type="submit"
          disabled={revokeMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: revokeMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: revokeMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {revokeMutation.isPending ? 'Revoking...' : 'Revoke public link'}
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
          Quick: id=7 (200)
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
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {revokeMutation.isError && (
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
            {JSON.stringify(revokeMutation.error, null, 2)}
          </pre>
        )}
        {revokeMutation.isSuccess && (
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
            {JSON.stringify(revokeMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



import React from 'react'
import { useRemoveShareUser } from '@/api/features/share/share.mutations'

export default function ShareRemoveUserTestPage() {
  const [shareId, setShareId] = React.useState<string>('')
  const [userId, setUserId] = React.useState<string>('')

  const mutation = useRemoveShareUser()

  const numericShareId = shareId === '' ? undefined : Number(shareId)
  const numericUserId = userId === '' ? undefined : Number(userId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericShareId === undefined || Number.isNaN(numericShareId) || numericShareId <= 0) {
      alert('Share ID must be a positive number')
      return
    }

    if (numericUserId === undefined || Number.isNaN(numericUserId) || numericUserId <= 0) {
      alert('User ID must be a positive number')
      return
    }

    mutation.mutate({
      shareId: numericShareId,
      userId: numericUserId,
    })
  }

  const runQuick = (mode: 'unauth' | 'not-found' | 'success') => {
    if (mode === 'unauth') {
      setShareId('1')
      setUserId('10')
      return
    }

    if (mode === 'not-found') {
      setShareId('13')
      setUserId('9')
      return
    }

    setShareId('4')
    setUserId('15')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Share Remove User Test</h1>
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
          Share ID:
          <input
            type="number"
            value={shareId}
            onChange={event => setShareId(event.target.value)}
          />
        </label>
        <label>
          User ID:
          <input
            type="number"
            value={userId}
            onChange={event => setUserId(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={mutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: mutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: mutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {mutation.isPending ? 'Removing...' : 'Remove user from share'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
          Quick: share/user not found (404)
        </button>
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
          Quick: remove user (200)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {mutation.isError && (
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
            {JSON.stringify(mutation.error, null, 2)}
          </pre>
        )}
        {mutation.isSuccess && (
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
            {JSON.stringify(mutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



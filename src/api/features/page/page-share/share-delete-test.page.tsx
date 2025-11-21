import React from 'react'
import { useDeleteShare } from '@/api/features/share/share.mutations'

export default function ShareDeleteTestPage() {
  const [shareId, setShareId] = React.useState<string>('')

  const deleteMutation = useDeleteShare()

  const numericShareId = shareId === '' ? undefined : Number(shareId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericShareId === undefined || Number.isNaN(numericShareId) || numericShareId <= 0) {
      alert('Share ID must be a positive number')
      return
    }

    deleteMutation.mutate({ id: numericShareId })
  }

  const runQuick = (mode: 'unauth' | 'not-found' | 'success') => {
    if (mode === 'unauth') {
      setShareId('1')
      return
    }

    if (mode === 'not-found') {
      setShareId('9')
      return
    }

    setShareId('2')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Share Delete Test</h1>
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
        <button
          type="submit"
          disabled={deleteMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: deleteMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: deleteMutation.isPending ? '#9ca3af' : '#dc2626',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete share'}
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
          Quick: share not found (404)
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
          Quick: delete share (200)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {deleteMutation.isError && (
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
            {JSON.stringify(deleteMutation.error, null, 2)}
          </pre>
        )}
        {deleteMutation.isSuccess && (
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
            {JSON.stringify(deleteMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



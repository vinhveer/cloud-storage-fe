import React from 'react'
import { useEmptyTrash } from '@/api/features/trash/trash.mutations'

export default function TrashEmptyTestPage() {
  const emptyTrashMutation = useEmptyTrash()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()
    emptyTrashMutation.mutate()
  }

  const runQuick = (mode: 'success' | 'unauth') => {
    // Just a helper to indicate which test case
    // The actual test depends on authentication state
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Trash Empty Test</h1>
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
        <div
          style={{
            padding: 12,
            borderRadius: 6,
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: 14,
          }}
        >
          ⚠️ <strong>CẢNH BÁO:</strong> Hành động này sẽ xóa vĩnh viễn TẤT CẢ file và folder trong thùng rác và không thể khôi phục!
        </div>
        <button
          type="submit"
          disabled={emptyTrashMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: emptyTrashMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: emptyTrashMutation.isPending ? '#9ca3af' : '#dc2626',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {emptyTrashMutation.isPending ? 'Emptying trash...' : 'Empty trash permanently'}
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
          Quick: empty trash (200)
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
        {emptyTrashMutation.isError && (
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
            {JSON.stringify(emptyTrashMutation.error, null, 2)}
          </pre>
        )}
        {emptyTrashMutation.isSuccess && (
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
            {JSON.stringify(emptyTrashMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}


import React from 'react'
import { useAdminUserDetail } from '@/api/features/users/users.queries'

export default function AdminUserDetailTestPage() {
  const [userIdInput, setUserIdInput] = React.useState<string>('7')
  const numericId = userIdInput === '' ? undefined : Number(userIdInput)
  const query = useAdminUserDetail(Number.isNaN(numericId as number) ? undefined : numericId)

  const runQuick = (mode: 'success' | 'not-found' | 'unauthenticated' | 'unauthorized') => {
    if (mode === 'success') {
      setUserIdInput('7')
      return
    }
    if (mode === 'not-found') {
      setUserIdInput('999999')
      return
    }
    if (mode === 'unauthenticated') {
      alert('Để test 401 Unauthenticated: vui lòng logout trước rồi bấm Fetch.')
      setUserIdInput('2')
      return
    }
    alert('Để test unauthorized 500: đăng nhập user thường (không admin) rồi bấm Fetch.')
    setUserIdInput('2')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Admin User Detail Test</h1>
      <form
        onSubmit={event => {
          event.preventDefault()
          query.refetch()
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 360,
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <label>
          User ID:
          <input
            type="number"
            value={userIdInput}
            onChange={event => setUserIdInput(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={query.isFetching || !userIdInput}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: query.isFetching ? 'not-allowed' : 'pointer',
            backgroundColor: query.isFetching ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {query.isFetching ? 'Loading...' : 'Fetch user'}
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
          Quick: success (200)
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
          Quick: not found (404)
        </button>
        <button
          type="button"
          onClick={() => runQuick('unauthenticated')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#6b7280',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: unauthenticated (401)
        </button>
        <button
          type="button"
          onClick={() => runQuick('unauthorized')}
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
          Quick: unauthorized (500)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {query.isError && (
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
            {JSON.stringify(query.error, null, 2)}
          </pre>
        )}
        {query.isSuccess && (
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
            {JSON.stringify(query.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



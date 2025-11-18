import React from 'react'
import { useDeleteAdminUser } from '@/api/features/users/admin-user-delete.mutations'

export default function AdminUserDeleteTestPage() {
  const [userId, setUserId] = React.useState<string>('7')
  const mutation = useDeleteAdminUser()

  const runQuick = (mode: 'success' | 'unauthenticated' | 'unauthorized' | 'self' | 'admin' | 'not-found') => {
    if (mode === 'success') {
      setUserId('7')
      return
    }
    if (mode === 'unauthenticated') {
      // eslint-disable-next-line no-alert
      alert('Để test 401 Unauthenticated: vui lòng logout trước rồi bấm Delete.')
      setUserId('2')
      return
    }
    if (mode === 'unauthorized') {
      // eslint-disable-next-line no-alert
      alert('Để test unauthorized 500: đăng nhập user thường (không admin) rồi bấm Delete.')
      setUserId('2')
      return
    }
    if (mode === 'self') {
      // eslint-disable-next-line no-alert
      alert('Để test 422: dùng token admin và nhập userId của chính admin (vd: 1).')
      setUserId('1')
      return
    }
    if (mode === 'admin') {
      // eslint-disable-next-line no-alert
      alert('Để test 403: dùng token admin và nhập userId là admin khác (vd: 14).')
      setUserId('14')
      return
    }
    setUserId('999999')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Admin User Delete Test</h1>
      <form
        onSubmit={event => {
          event.preventDefault()
          const id = Number(userId)
          if (Number.isNaN(id)) {
            // eslint-disable-next-line no-alert
            alert('User ID phải là số hợp lệ.')
            return
          }
          mutation.mutate(id)
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
            backgroundColor: mutation.isPending ? '#9ca3af' : '#dc2626',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {mutation.isPending ? 'Deleting...' : 'Delete user'}
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
            backgroundColor: '#f59e0b',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: unauthorized (500)
        </button>
        <button
          type="button"
          onClick={() => runQuick('self')}
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
          Quick: cannot delete self (422)
        </button>
        <button
          type="button"
          onClick={() => runQuick('admin')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#9333ea',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: delete admin (403)
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
          Quick: user not found (404)
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



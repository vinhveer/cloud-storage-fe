import React from 'react'
import { useUpdateAdminUserRole } from '@/api/features/users/users.mutations'

export default function AdminUserRoleUpdateTestPage() {
  const [userId, setUserId] = React.useState<string>('12')
  const [role, setRole] = React.useState<'user' | 'admin'>('admin')

  const mutation = useUpdateAdminUserRole()

  const runQuick = (
    mode: 'success' | 'unauthenticated' | 'unauthorized' | 'missing' | 'invalid' | 'not-found' | 'self-demotion',
  ) => {
    if (mode === 'success') {
      setUserId('12')
      setRole('admin')
      return
    }
    if (mode === 'missing') {
      // eslint-disable-next-line no-alert
      alert('Để test 422 thiếu role: xoá tay role (không chọn) là không hợp lệ. Ở form ta luôn bắt buộc chọn.')
      return
    }
    if (mode === 'invalid') {
      // eslint-disable-next-line no-alert
      alert("Để test 422 invalid role: backend yêu cầu role thuộc ['user','admin']. Hãy gọi API thủ công với role=owner nếu cần.")
      return
    }
    if (mode === 'not-found') {
      setUserId('999999')
      setRole('admin')
      return
    }
    if (mode === 'self-demotion') {
      setUserId('1')
      setRole('user')
      // eslint-disable-next-line no-alert
      alert('Để test self-demotion 422: dùng token admin có id=1.')
      return
    }
    if (mode === 'unauthenticated') {
      // eslint-disable-next-line no-alert
      alert('Để test 401 Unauthenticated: vui lòng logout trước rồi bấm Update.')
      setUserId('2')
      setRole('admin')
      return
    }
    // unauthorized (non-admin)
    // eslint-disable-next-line no-alert
    alert('Để test unauthorized 500: đăng nhập user thường (không admin) rồi bấm Update.')
    setUserId('2')
    setRole('admin')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Admin User Role Update Test</h1>
      <form
        onSubmit={event => {
          event.preventDefault()
          const id = Number(userId)
          if (Number.isNaN(id)) {
            // eslint-disable-next-line no-alert
            alert('User ID phải là số hợp lệ.')
            return
          }
          mutation.mutate({ userId: id, role })
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
        <label>
          Role:
          <select value={role} onChange={event => setRole(event.target.value as 'user' | 'admin')}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
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
          {mutation.isPending ? 'Updating...' : 'Update role'}
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
          onClick={() => runQuick('missing')}
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
          Quick: missing role (422)
        </button>
        <button
          type="button"
          onClick={() => runQuick('invalid')}
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
          Quick: invalid role (422)
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
        <button
          type="button"
          onClick={() => runQuick('self-demotion')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: self demotion (422)
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



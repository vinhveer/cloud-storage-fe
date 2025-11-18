import React from 'react'
import { useUpdateAdminUser } from '@/api/features/users/admin-user-update.mutations'

export default function AdminUserUpdateTestPage() {
  const [userId, setUserId] = React.useState<string>('12')
  const [name, setName] = React.useState<string>('Updated Name')
  const [storageLimit, setStorageLimit] = React.useState<string>('1000000')

  const mutation = useUpdateAdminUser()

  const runQuick = (mode: 'success' | 'not-found' | 'unauthenticated' | 'unauthorized') => {
    if (mode === 'success') {
      setUserId('12')
      setName('Updated Name')
      setStorageLimit('1000000')
      return
    }
    if (mode === 'not-found') {
      setUserId('999999')
      setName('Updated Name')
      setStorageLimit('1000000')
      return
    }
    if (mode === 'unauthenticated') {
      // eslint-disable-next-line no-alert
      alert('Để test 401 Unauthenticated: vui lòng logout trước rồi bấm Update.')
      setUserId('2')
      setName('Updated Name')
      setStorageLimit('')
      return
    }
    // unauthorized (non-admin)
    // eslint-disable-next-line no-alert
    alert('Để test unauthorized 500: đăng nhập user thường (không admin) rồi bấm Update.')
    setUserId('2')
    setName('Updated Name')
    setStorageLimit('')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Admin User Update Test</h1>
      <form
        onSubmit={event => {
          event.preventDefault()
          const id = Number(userId)
          const storage = storageLimit === '' ? undefined : Number(storageLimit)
          if (Number.isNaN(id)) {
            // eslint-disable-next-line no-alert
            alert('User ID phải là số hợp lệ.')
            return
          }
          if (storageLimit !== '' && Number.isNaN(storage as number)) {
            // eslint-disable-next-line no-alert
            alert('Storage limit phải là số hợp lệ.')
            return
          }
          mutation.mutate({
            userId: id,
            name: name === '' ? undefined : name,
            storage_limit: storage,
          })
        }}
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
          User ID:
          <input
            type="number"
            value={userId}
            onChange={event => setUserId(event.target.value)}
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="leave empty to skip"
          />
        </label>
        <label>
          Storage limit:
          <input
            type="number"
            value={storageLimit}
            onChange={event => setStorageLimit(event.target.value)}
            placeholder="leave empty to skip"
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
          {mutation.isPending ? 'Updating...' : 'Update user'}
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
          Quick: user not found (404)
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



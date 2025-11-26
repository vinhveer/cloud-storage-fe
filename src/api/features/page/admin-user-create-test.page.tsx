import React from 'react'
import { useCreateUser } from '@/api/features/users/users.mutations'

export default function AdminUserCreateTestPage() {
  const [name, setName] = React.useState<string>('user 1111')
  const [email, setEmail] = React.useState<string>('user1111@gmail.com')
  const [password, setPassword] = React.useState<string>('12345678')
  const [role, setRole] = React.useState<'user' | 'admin'>('user')

  const mutation = useCreateUser()

  const runQuick = (mode: 'success' | 'unauthenticated' | 'unauthorized' | 'missing') => {
    if (mode === 'success') {
      setName('user 1111')
      setEmail('user1111@gmail.com')
      setPassword('12345678')
      setRole('user')
      return
    }
    if (mode === 'missing') {
      setName('')
      setEmail('')
      setPassword('')
      setRole('user')
      return
    }
    if (mode === 'unauthenticated') {
      alert('Để test 401 Unauthenticated: vui lòng logout trước rồi bấm Create.')
      return
    }
    alert('Để test unauthorized 500: đăng nhập user thường (không admin) rồi bấm Create.')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Admin User Create Test</h1>
      <form
        onSubmit={event => {
          event.preventDefault()
          mutation.mutate({ name, email, password, role })
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
          Name:
          <input
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
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
            backgroundColor: mutation.isPending ? '#9ca3af' : '#16a34a',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {mutation.isPending ? 'Creating...' : 'Create user'}
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
          Quick: success (201)
        </button>
        <button
          type="button"
          onClick={() => runQuick('missing')}
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
          Quick: missing fields (422)
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



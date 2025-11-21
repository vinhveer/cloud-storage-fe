import React from 'react'
import { useRestoreTrashItem } from '@/api/features/trash/trash.mutations'

export default function TrashRestoreTestPage() {
  const [id, setId] = React.useState<string>('')
  const [type, setType] = React.useState<'file' | 'folder'>('file')
  const restoreMutation = useRestoreTrashItem()

  const numericId = id === '' ? undefined : Number(id)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericId === undefined || Number.isNaN(numericId) || numericId <= 0) {
      alert('ID must be a positive number')
      return
    }

    restoreMutation.mutate({
      id: numericId,
      type,
    })
  }

  const runQuick = (
    mode: 'file' | 'folder' | 'missing-type' | 'invalid-type' | 'unauth' | 'child-item' | 'not-found',
  ) => {
    if (mode === 'file') {
      setId('45')
      setType('file')
      return
    }

    if (mode === 'folder') {
      setId('29')
      setType('folder')
      return
    }

    if (mode === 'missing-type') {
      setId('15')
      setType('file')
      return
    }

    if (mode === 'invalid-type') {
      setId('15')
      setType('file')
      return
    }

    if (mode === 'unauth') {
      setId('15')
      setType('file')
      return
    }

    if (mode === 'child-item') {
      setId('46')
      setType('file')
      return
    }

    if (mode === 'not-found') {
      setId('99999')
      setType('file')
      return
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Trash Restore Test</h1>
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
          ID:
          <input
            type="number"
            value={id}
            onChange={event => setId(event.target.value)}
            placeholder="Item ID"
            min="1"
            required
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              marginTop: 4,
            }}
          />
        </label>
        <label>
          Type:
          <select
            value={type}
            onChange={event => setType(event.target.value as 'file' | 'folder')}
            style={{
              width: '100%',
              padding: '6px 8px',
              borderRadius: 4,
              border: '1px solid #d1d5db',
              marginTop: 4,
            }}
          >
            <option value="file">file</option>
            <option value="folder">folder</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={restoreMutation.isPending || !id}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: restoreMutation.isPending || !id ? 'not-allowed' : 'pointer',
            backgroundColor: restoreMutation.isPending || !id ? '#9ca3af' : '#16a34a',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {restoreMutation.isPending ? 'Restoring...' : 'Restore item'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('file')}
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
          Quick: restore file (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('folder')}
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
          Quick: restore folder (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('missing-type')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#f97316',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: missing type (500)
        </button>
        <button
          type="button"
          onClick={() => runQuick('invalid-type')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#f97316',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: invalid type (500)
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
        <button
          type="button"
          onClick={() => runQuick('child-item')}
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
          Quick: child item (400)
        </button>
        <button
          type="button"
          onClick={() => runQuick('not-found')}
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
          Quick: not found (400)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {restoreMutation.isError && (
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
            {JSON.stringify(restoreMutation.error, null, 2)}
          </pre>
        )}
        {restoreMutation.isSuccess && (
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
            {JSON.stringify(restoreMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}


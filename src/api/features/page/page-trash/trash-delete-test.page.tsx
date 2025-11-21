import React from 'react'
import { useDeleteTrashItem } from '@/api/features/trash/trash.mutations'

export default function TrashDeleteTestPage() {
  const [id, setId] = React.useState<string>('')
  const [type, setType] = React.useState<'file' | 'folder'>('file')
  const deleteMutation = useDeleteTrashItem()

  const numericId = id === '' ? undefined : Number(id)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericId === undefined || Number.isNaN(numericId) || numericId <= 0) {
      alert('ID must be a positive number')
      return
    }

    deleteMutation.mutate({
      id: numericId,
      type,
    })
  }

  const runQuick = (
    mode: 'file' | 'folder' | 'invalid-type' | 'unauth' | 'child-item' | 'not-found',
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

    if (mode === 'invalid-type') {
      setId('1')
      setType('file')
      return
    }

    if (mode === 'unauth') {
      setId('1')
      setType('file')
      return
    }

    if (mode === 'child-item') {
      setId('51')
      setType('file')
      return
    }

    if (mode === 'not-found') {
      setId('999999')
      setType('file')
      return
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Trash Delete Test</h1>
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
          disabled={deleteMutation.isPending || !id}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: deleteMutation.isPending || !id ? 'not-allowed' : 'pointer',
            backgroundColor: deleteMutation.isPending || !id ? '#9ca3af' : '#dc2626',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete permanently'}
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
          Quick: delete file (200)
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
          Quick: delete folder (200)
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
          Quick: invalid type (422)
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


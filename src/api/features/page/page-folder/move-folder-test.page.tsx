import React from 'react'
import { useMoveFolder } from '@/api/features/folder/folder.mutations'

export default function MoveFolderTestPage() {
  const [folderId, setFolderId] = React.useState<string>('')
  const [targetFolderId, setTargetFolderId] = React.useState<string>('')

  const moveFolderMutation = useMoveFolder()

  const numericFolderId = folderId === '' ? undefined : Number(folderId)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (numericFolderId === undefined || Number.isNaN(numericFolderId)) {
      alert('Folder ID must be a number')
      return
    }

    let target: number | null = null

    if (targetFolderId !== '') {
      const numericTarget = Number(targetFolderId)
      if (Number.isNaN(numericTarget)) {
        alert('Target folder ID must be a number')
        return
      }
      target = numericTarget
    }

    moveFolderMutation.mutate({
      folderId: numericFolderId,
      target_folder_id: target,
    })
  }

  const runQuick = (
    mode: 'happy-root' | 'unauth' | 'invalid-target-422' | 'target-not-found-404' | 'move-descendant-400',
  ) => {
    if (mode === 'happy-root') {
      setFolderId('29')
      setTargetFolderId('')
      return
    }

    if (mode === 'unauth') {
      setFolderId('123')
      setTargetFolderId('45')
      return
    }

    if (mode === 'invalid-target-422') {
      setFolderId('11')
      setTargetFolderId('1111')
      return
    }

    if (mode === 'target-not-found-404') {
      setFolderId('11')
      setTargetFolderId('29')
      return
    }

    setFolderId('29')
    setTargetFolderId('30')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Move Folder Test</h1>
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
          Folder ID:
          <input
            type="number"
            value={folderId}
            onChange={event => setFolderId(event.target.value)}
          />
        </label>
        <label>
          Target folder ID (null = move to root):
          <input
            type="number"
            value={targetFolderId}
            onChange={event => setTargetFolderId(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={moveFolderMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: moveFolderMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: moveFolderMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {moveFolderMutation.isPending ? 'Moving...' : 'Move folder'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('happy-root')}
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
          Quick: move 29 to root (200)
        </button>
        <button
          type="button"
          onClick={() => runQuick('unauth')}
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
          Quick: unauth (401)
        </button>
        <button
          type="button"
          onClick={() => runQuick('invalid-target-422')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#facc15',
            color: '#1f2937',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: invalid target (422)
        </button>
        <button
          type="button"
          onClick={() => runQuick('target-not-found-404')}
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
          Quick: target not found (404)
        </button>
        <button
          type="button"
          onClick={() => runQuick('move-descendant-400')}
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
          Quick: move into descendant (400)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {moveFolderMutation.isError && (
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
            {JSON.stringify(moveFolderMutation.error, null, 2)}
          </pre>
        )}
        {moveFolderMutation.isSuccess && (
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
            {JSON.stringify(moveFolderMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



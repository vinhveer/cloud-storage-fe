import React from 'react'
import { useCreateShare } from '@/api/features/share/share.mutations'

type ShareableType = 'file' | 'folder'

export default function ShareCreateTestPage() {
  const [shareableType, setShareableType] = React.useState<ShareableType>('file')
  const [shareableId, setShareableId] = React.useState<string>('')
  const [userIdsInput, setUserIdsInput] = React.useState<string>('')
  const [permission, setPermission] = React.useState<string>('view')

  const shareMutation = useCreateShare()

  const parseUserIds = (input: string): number[] => {
    return input
      .split(',')
      .map(part => part.trim())
      .filter(part => part !== '')
      .map(part => Number(part))
      .filter(id => !Number.isNaN(id) && id > 0)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault()

    if (!shareableId || Number.isNaN(Number(shareableId)) || Number(shareableId) <= 0) {
      alert('shareable_id must be a positive number')
      return
    }

    const userIds = parseUserIds(userIdsInput)
    if (userIds.length === 0) {
      alert('At least one valid user id is required')
      return
    }

    if (!permission.trim()) {
      alert('permission is required')
      return
    }

    shareMutation.mutate({
      shareable_type: shareableType,
      shareable_id: Number(shareableId),
      user_ids: userIds,
      permission,
    })
  }

  const runQuick = (
    mode:
      | 'success-create'
      | 'reshare-same'
      | 'reshare-change-permission'
      | 'add-new-existing'
      | 'unauth'
      | 'missing-fields'
      | 'invalid-type'
      | 'not-found'
      | 'empty-recipients'
      | 'invalid-permission',
  ) => {
    if (mode === 'success-create') {
      setShareableType('file')
      setShareableId('58')
      setUserIdsInput('15,8')
      setPermission('edit')
      return
    }

    if (mode === 'reshare-same') {
      setShareableType('file')
      setShareableId('58')
      setUserIdsInput('15,8')
      setPermission('edit')
      return
    }

    if (mode === 'reshare-change-permission') {
      setShareableType('file')
      setShareableId('58')
      setUserIdsInput('15,8')
      setPermission('view')
      return
    }

    if (mode === 'add-new-existing') {
      setShareableType('file')
      setShareableId('58')
      setUserIdsInput('15,8,2')
      setPermission('view')
      return
    }

    if (mode === 'unauth') {
      setShareableType('file')
      setShareableId('57')
      setUserIdsInput('8')
      setPermission('view')
      return
    }

    if (mode === 'missing-fields') {
      setShareableType('file')
      setShareableId('')
      setUserIdsInput('')
      setPermission('')
      return
    }

    if (mode === 'invalid-type') {
      setShareableType('file')
      setShareableId('64')
      setUserIdsInput('8')
      setPermission('edit')
      // shareable_type invalid sẽ phải sửa tay trong JSON nếu test trên Postman;
      // ở FE ta gửi đúng enum nên case này sẽ khó tái hiện, user có thể mock backend riêng.
      return
    }

    if (mode === 'not-found') {
      setShareableType('file')
      setShareableId('999999')
      setUserIdsInput('2')
      setPermission('view')
      return
    }

    if (mode === 'empty-recipients') {
      setShareableType('file')
      setShareableId('1')
      setUserIdsInput('')
      setPermission('view')
      return
    }

    setShareableType('file')
    setShareableId('1')
    setUserIdsInput('2')
    setPermission('invalid')
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Share Create Test</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          maxWidth: 520,
          padding: 16,
          borderRadius: 8,
          border: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <label>
          Shareable type:
          <select
            value={shareableType}
            onChange={event => setShareableType(event.target.value as ShareableType)}
          >
            <option value="file">file</option>
            <option value="folder">folder</option>
          </select>
        </label>
        <label>
          Shareable ID (shareable_id):
          <input
            type="number"
            value={shareableId}
            onChange={event => setShareableId(event.target.value)}
          />
        </label>
        <label>
          User IDs (comma separated):
          <input
            type="text"
            value={userIdsInput}
            onChange={event => setUserIdsInput(event.target.value)}
            placeholder="vd: 15,8"
          />
        </label>
        <label>
          Permission:
          <input
            type="text"
            value={permission}
            onChange={event => setPermission(event.target.value)}
            placeholder="view hoặc edit"
          />
        </label>
        <button
          type="submit"
          disabled={shareMutation.isPending}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: 'none',
            cursor: shareMutation.isPending ? 'not-allowed' : 'pointer',
            backgroundColor: shareMutation.isPending ? '#9ca3af' : '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
          }}
        >
          {shareMutation.isPending ? 'Sharing...' : 'Share'}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => runQuick('success-create')}
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
          Quick: create share (201)
        </button>
        <button
          type="button"
          onClick={() => runQuick('reshare-same')}
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
          Quick: re-share same permission
        </button>
        <button
          type="button"
          onClick={() => runQuick('reshare-change-permission')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#6366f1',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: re-share with changed permission
        </button>
        <button
          type="button"
          onClick={() => runQuick('add-new-existing')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#22c55e',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: add new + existing users
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
          onClick={() => runQuick('missing-fields')}
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
          Quick: missing fields (422)
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
          Quick: shareable not found (404)
        </button>
        <button
          type="button"
          onClick={() => runQuick('empty-recipients')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#fb7185',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Quick: empty recipients (422)
        </button>
        <button
          type="button"
          onClick={() => runQuick('invalid-permission')}
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
          Quick: invalid permission (422)
        </button>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>Result</h2>
        {shareMutation.isError && (
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
            {JSON.stringify(shareMutation.error, null, 2)}
          </pre>
        )}
        {shareMutation.isSuccess && (
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
            {JSON.stringify(shareMutation.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}



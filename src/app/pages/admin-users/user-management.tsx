import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import TableData from '@/components/TableData'
import { createColumns } from '@/components/Table/createColumns'
import { Button } from '@/components/Button/Button'
import { useUserManagement, type TableUser } from './hooks/useUserManagement'
import CreateUserModal from './components/CreateUserModal'
import EditUserModal from './components/EditUserModal'
import UserDetailModal from './components/UserDetailModal'
import DeleteUserDialog from './components/DeleteUserDialog'
import ChangeRoleDialog from './components/ChangeRoleDialog'

export default function AdminUserManagementPage() {
  const {
    search,
    setSearch,
    hasSelection,
    setHasSelection,
    tableUsers,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    createOpen,
    setCreateOpen,
    editUser,
    setEditUser,
    detailUserId,
    userDetail,
    storageUsage,
    isLoadingDetail,
    isLoadingStorage,
    openDetail,
    closeDetail,
    roleDialogUser,
    setRoleDialogUser,
    roleDialogOpen,
    setRoleDialogOpen,
    deleteUsers,
    setDeleteUsers,
    deleteDialogOpen,
    setDeleteDialogOpen,
    canDeleteUser,
    canChangeRole,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleChangeRole,
    createMutation,
    updateUserMutation,
    deleteUserMutation,
    updateRoleMutation,
  } = useUserManagement()

  const columns = createColumns<TableUser>({
    name: { label: 'Name', sortable: true },
    email: { label: 'Email', sortable: true },
    role: { label: 'Role', sortable: true },
    storage_limit: { label: 'Storage limit (Byte)' },
    storage_used: { label: 'Storage used (Byte)' },
  })

  columns.forEach(col => {
    if (col.key === 'role') {
      col.render = (value: any, row: TableUser) => {
        const roleMap: Record<string, { label: string; bg: string }> = {
          admin: { label: 'Admin', bg: 'rounded px-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
          user: { label: 'User', bg: 'rounded px-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
        }
        const roleInfo = roleMap[value] || { label: value, bg: 'bg-gray-100' }
        const disabled = !canChangeRole(row) || updateRoleMutation.isPending
        return (
          <button
            type="button"
            className={`inline-flex px-2 py-1 rounded text-sm font-medium border border-transparent hover:border-blue-300 hover:shadow-sm transition-colors ${
              disabled ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            onClick={e => {
              e.stopPropagation()
              if (!disabled) {
                setRoleDialogUser(row)
                setRoleDialogOpen(true)
              }
            }}
            disabled={disabled}
            title={!canChangeRole(row) ? 'Cannot change your own role' : ''}
          >
            <span className={roleInfo.bg}>{roleInfo.label}</span>
          </button>
        )
      }
    }
  })

  const toolbarActions = [
    { id: 'detail', label: 'Account details', icon: <EyeIcon className="w-4 h-4" />, requireSingle: true },
    { id: 'edit', label: 'Edit account', icon: <PencilIcon className="w-4 h-4" />, requireSingle: true },
    { id: 'change-role', label: 'Change role', icon: <PencilIcon className="w-4 h-4" />, requireSingle: true },
    { id: 'delete', label: 'Delete account', icon: <TrashIcon className="w-4 h-4" /> },
  ] as const

  const contextMenuActions = [
    { id: 'detail', label: 'Account details', icon: <EyeIcon className="w-4 h-4" /> },
    { id: 'edit', label: 'Edit account', icon: <PencilIcon className="w-4 h-4" /> },
    { id: 'change-role', label: 'Change role', icon: <PencilIcon className="w-4 h-4" /> },
    { id: 'delete', label: 'Delete account', icon: <TrashIcon className="w-4 h-4" /> },
  ] as const

  const handleSingleRowAction = (actionId: string, user: TableUser) => {
    switch (actionId) {
      case 'detail':
        openDetail(user)
        break
      case 'edit':
        setEditUser(user)
        break
      case 'change-role':
        if (canChangeRole(user)) {
          setRoleDialogUser(user)
          setRoleDialogOpen(true)
        }
        break
      case 'delete':
        if (canDeleteUser(user)) {
          setDeleteUsers([user])
          setDeleteDialogOpen(true)
        }
        break
      default:
        break
    }
  }

  const handleToolbarAction = (actionId: string, rows: TableUser[]) => {
    if (rows.length === 0) return

    if (actionId === 'delete') {
      const deletableUsers = rows.filter(canDeleteUser)
      if (deletableUsers.length === 0) {
        return
      }
      setDeleteUsers(deletableUsers)
      setDeleteDialogOpen(true)
      return
    }

    const primary = rows[0]
    if (actionId === 'change-role' && !canChangeRole(primary)) {
      return
    }
    handleSingleRowAction(actionId, primary)
  }

  const handleDeleteConfirm = async () => {
    const userIds = deleteUsers.map(u => u.user_id)
    await handleDelete(userIds)
  }


  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage users, roles, and storage limits
        </p>
      </header>

      <section className="space-y-4 flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between flex-shrink-0">
          {!hasSelection && (
            <Button
              variant="primary"
              size="md"
              className="h-12"
              icon={<PlusIcon className="w-4 h-4" />}
              value="Create user"
              onClick={() => setCreateOpen(true)}
            />
          )}
          <div className="relative flex-1 max-w-md ml-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500">
              <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="block w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <TableData<TableUser>
            columns={columns}
            data={tableUsers}
            selectable
            onSelectionChange={selectedIds => setHasSelection(selectedIds.length > 0)}
            toolbarActions={toolbarActions as any}
            onToolbarAction={(actionId, rows) => handleToolbarAction(actionId, rows as TableUser[])}
            contextMenuActions={contextMenuActions as any}
            onContextMenuAction={(actionId, row) => handleSingleRowAction(actionId, row as TableUser)}
            emptyMessage={isLoading ? 'Loading users...' : 'No users found'}
            loading={isLoading}
            onLoadMore={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
              }
            }}
            hasMore={hasNextPage ?? false}
            isLoadingMore={isFetchingNextPage}
          />
        </div>
      </section>

      <CreateUserModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      <EditUserModal
        user={editUser}
        onClose={() => setEditUser(null)}
        onSubmit={handleUpdate}
        isLoading={updateUserMutation.isPending}
      />

      <UserDetailModal
        userId={detailUserId}
        userDetail={userDetail}
        storageUsage={storageUsage}
        isLoadingDetail={isLoadingDetail}
        isLoadingStorage={isLoadingStorage}
        onClose={closeDetail}
      />

      {roleDialogUser && (
        <ChangeRoleDialog
          user={roleDialogUser}
          open={roleDialogOpen}
          onOpenChange={(open) => {
            setRoleDialogOpen(open)
            if (!open) {
              setRoleDialogUser(null)
            }
          }}
          onConfirm={handleChangeRole}
          isLoading={updateRoleMutation.isPending}
        />
      )}

      <DeleteUserDialog
        users={deleteUsers}
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) {
            setDeleteUsers([])
          }
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import Table from '@/components/Table/Table'
import { createColumns } from '@/components/Table/createColumns'
import Offcanvas from '@/components/Offcanvas/Offcanvas'
import { Button } from '@/components/Button/Button'
import Dialog from '@/components/Dialog/Dialog'
import StorageUsage from '@/components/StorageUsage/StorageUsage'
import type { AdminUserItem, AdminUsersSuccess } from '@/api/features/users/users.types'
import { useInfiniteUsers } from '@/api/features/users/users.queries'
import { useCreateUser, useUpdateUser, useDeleteUser, useUpdateUserRole } from '@/api/features/users/users.mutations'

type TableUser = AdminUserItem & {
    id: number
}

export default function AdminUserManagementPage() {
    const [hasSelection, setHasSelection] = useState(false)
    const [createOpen, setCreateOpen] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState<'user' | 'admin'>('user')

    const [roleDialogOpen, setRoleDialogOpen] = useState(false)
    const [roleDialogUser, setRoleDialogUser] = useState<TableUser | null>(null)
    const [roleDialogValue, setRoleDialogValue] = useState<'user' | 'admin'>('user')

    const [editUser, setEditUser] = useState<TableUser | null>(null)
    const [editName, setEditName] = useState('')
    const [editStorageLimit, setEditStorageLimit] = useState<number | ''>('')

    const [detailUser, setDetailUser] = useState<TableUser | null>(null)

    const [deleteUsers, setDeleteUsers] = useState<TableUser[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const createMutation = useCreateUser()
    const updateUserMutation = useUpdateUser()
    const deleteUserMutation = useDeleteUser()
    const updateRoleMutation = useUpdateUserRole()

    // Load users with infinite scroll and pagination
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        refetch,
    } = useInfiniteUsers({}, 10)

    const apiPages = (data?.pages ?? []) as AdminUsersSuccess[]
    const users: AdminUserItem[] = apiPages.flatMap(page => page.data)
    const tableUsers: TableUser[] = users.map(user => ({
        ...user,
        id: user.user_id,
    }))

    const loadMoreRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const node = loadMoreRef.current
        if (!node) return

        const observer = new IntersectionObserver(entries => {
            const entry = entries[0]
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
            }
        })

        observer.observe(node)

        return () => {
            observer.disconnect()
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    const openCreate = () => {
        setName('')
        setEmail('')
        setPassword('')
        setRole('user')
        setCreateOpen(true)
    }

    const handleCreateSubmit: React.FormEventHandler<HTMLFormElement> = event => {
        event.preventDefault()
        createMutation.mutate(
            {
                name,
                email,
                password,
                role,
            },
            {
                onSuccess: () => {
                    setName('')
                    setEmail('')
                    setPassword('')
                    setRole('user')
                    setCreateOpen(false)
                    refetch()
                },
            },
        )
    }

    const columns = createColumns<TableUser>({
        name: { label: 'Name', sortable: true },
        email: { label: 'Email', sortable: true },
        role: { label: 'Role', sortable: true },
        storage_limit: { label: 'Storage limit (Byte)' },
        storage_used: { label: 'Storage used (Byte)' },
    })

    // Custom render for role
    columns.forEach(col => {
        if (col.key === 'role') {
            col.render = (value: any, row: TableUser) => {
                const roleMap: Record<string, { label: string; bg: string }> = {
                    admin: { label: 'Admin', bg: 'rounded px-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
                    user: { label: 'User', bg: 'rounded px-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
                }
                const roleInfo = roleMap[value] || { label: value, bg: 'bg-gray-100' }
                return (
                    <button
                        type="button"
                        className="inline-flex px-2 py-1 rounded text-sm font-medium border border-transparent hover:border-blue-300 hover:shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={e => {
                            e.stopPropagation()
                            setRoleDialogUser(row)
                            setRoleDialogValue((value as 'user' | 'admin') ?? 'user')
                            setRoleDialogOpen(true)
                        }}
                        disabled={updateRoleMutation.isPending}
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

    const openEditUser = (user: TableUser) => {
        setEditUser(user)
        setEditName(user.name ?? '')
        setEditStorageLimit(typeof user.storage_limit === 'number' ? user.storage_limit : '')
    }

    const openDetailUser = (user: TableUser) => {
        setDetailUser(user)
    }

    const openChangeRoleDialog = (user: TableUser) => {
        setRoleDialogUser(user)
        setRoleDialogValue((user.role as 'user' | 'admin') ?? 'user')
        setRoleDialogOpen(true)
    }

    const openDeleteDialog = (user: TableUser) => {
        setDeleteUsers([user])
        setDeleteDialogOpen(true)
    }

    const handleSingleRowAction = (actionId: string, user: TableUser) => {
        switch (actionId) {
            case 'detail':
                openDetailUser(user)
                break
            case 'edit':
                openEditUser(user)
                break
            case 'change-role':
                openChangeRoleDialog(user)
                break
            case 'delete':
                openDeleteDialog(user)
                break
            default:
                break
        }
    }

    const handleToolbarAction = (actionId: string, rows: TableUser[]) => {
        if (rows.length === 0) return

        if (actionId === 'delete') {
            setDeleteUsers(rows)
            setDeleteDialogOpen(true)
            return
        }

        const primary = rows[0]
        handleSingleRowAction(actionId, primary)
    }

    return (

        <div className="space-y-4">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
                    User Management
                </h1>
            </header>

            <section className="space-y-4">
                <div className="flex justify-start">
                    {!hasSelection && (
                        <Button
                            variant="primary"
                            size="md"
                            className="h-12 mt-5"
                            icon={<PlusIcon className="w-4 h-4" />}
                            value="Create user"
                            onClick={openCreate}
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <Table<TableUser>
                        key={tableUsers.length}
                        columns={columns}
                        data={tableUsers}
                        selectable
                        onSelectionChange={selectedIds => setHasSelection(selectedIds.length > 0)}
                        toolbarActions={toolbarActions as any}
                        onToolbarAction={(actionId, rows) => handleToolbarAction(actionId, rows as TableUser[])}
                        contextMenuActions={contextMenuActions as any}
                        onContextMenuAction={(actionId, row) => handleSingleRowAction(actionId, row as TableUser)}
                        onRowClick={row => console.log('Selected user:', row)}
                        emptyMessage={isLoading ? 'Loading users...' : 'No users found'}
                        maxBodyHeight={450}
                    />
                    <div ref={loadMoreRef} className="h-8" />

                </div>
            </section>
            <Offcanvas
                id="create-admin-user-offcanvas"
                title="Create new user"
                alignment="right"
                width="50"
                open={createOpen}
                onOpenChange={setCreateOpen}
            >
                <form className="space-y-6" onSubmit={handleCreateSubmit} autoComplete="off">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="create-name">
                            User name
                        </label>
                        <input
                            id="create-name"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="create-email">
                            Email
                        </label>
                        <input
                            id="create-email"
                            type="email"
                            autoComplete="new-email"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="create-password">
                            Password
                        </label>
                        <input
                            id="create-password"
                            type="password"
                            autoComplete="new-password"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="create-role">
                            Role
                        </label>
                        <select
                            id="create-role"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-sm"
                            value={role}
                            onChange={e => setRole(e.target.value as 'user' | 'admin')}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="space-y-3 pt-4">
                        <Button
                            variant="primary"
                            size="md"
                            type="submit"
                            isLoading={createMutation.isPending}
                            className="w-full"
                        >
                            Save
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            type="button"
                            className="w-full"
                            onClick={() => setCreateOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Offcanvas>

            {roleDialogUser && (
                <Dialog
                    id="change-role-dialog"
                    title="Change user role"
                    open={roleDialogOpen}
                    onOpenChange={open => {
                        setRoleDialogOpen(open)
                        if (!open) {
                            setRoleDialogUser(null)
                        }
                    }}
                    confirmButtonText="Save"
                    cancelButtonText="Cancel"
                    confirmType="primary"
                    onCancel={() => {
                        if (updateRoleMutation.isPending) return
                        setRoleDialogOpen(false)
                        setRoleDialogUser(null)
                    }}
                    onConfirm={async () => {
                        if (!roleDialogUser) return
                        await new Promise<void>((resolve, reject) => {
                            updateRoleMutation.mutate(
                                {
                                    userId: roleDialogUser.user_id,
                                    role: roleDialogValue,
                                },
                                {
                                    onSuccess: () => {
                                        refetch()
                                        resolve()
                                    },
                                    onError: () => {
                                        reject(new Error('Failed to update role'))
                                    },
                                },
                            )
                        })
                    }}
                >
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="text-gray-500 dark:text-gray-400">User:</span>{' '}
                                <span className="font-medium text-gray-900 dark:text-gray-100">{roleDialogUser.name}</span>
                            </p>
                        </div>

                        <div className="space-y-3">
                            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</span>
                            <div className="inline-flex w-full gap-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 p-1">
                                <button
                                    type="button"
                                    className={[
                                        'flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all',
                                        roleDialogValue === 'user'
                                            ? 'bg-white dark:bg-gray-900 border-blue-500 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'bg-transparent border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60',
                                        updateRoleMutation.isPending && 'opacity-60 cursor-not-allowed',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    onClick={() => {
                                        if (updateRoleMutation.isPending) return
                                        setRoleDialogValue('user')
                                    }}
                                >
                                    User
                                </button>
                                <button
                                    type="button"
                                    className={[
                                        'flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all',
                                        roleDialogValue === 'admin'
                                            ? 'bg-white dark:bg-gray-900 border-purple-500 text-purple-600 dark:text-purple-300 shadow-sm'
                                            : 'bg-transparent border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/60',
                                        updateRoleMutation.isPending && 'opacity-60 cursor-not-allowed',
                                    ]
                                        .filter(Boolean)
                                        .join(' ')}
                                    onClick={() => {
                                        if (updateRoleMutation.isPending) return
                                        setRoleDialogValue('admin')
                                    }}
                                >
                                    Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}

            {editUser && (
                <Offcanvas
                    id="edit-admin-user-offcanvas"
                    title="Edit account"
                    alignment="right"
                    width="50"
                    open={Boolean(editUser)}
                    onOpenChange={open => {
                        if (!open) {
                            setEditUser(null)
                        }
                    }}
                >
                    <form
                        className="space-y-4"
                        onSubmit={event => {
                            event.preventDefault()
                            if (!editUser) return
                            updateUserMutation.mutate(
                                {
                                    userId: editUser.user_id,
                                    name: editName,
                                    storage_limit:
                                        editStorageLimit === '' || Number.isNaN(Number(editStorageLimit))
                                            ? undefined
                                            : Number(editStorageLimit),
                                },
                                {
                                    onSuccess: () => {
                                        setEditUser(null)
                                        refetch()
                                    },
                                },
                            )
                        }}
                    >
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="edit-name">
                                Name
                            </label>
                            <input
                                id="edit-name"
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="edit-email">
                                Email
                            </label>
                            <input
                                id="edit-email"
                                type="email"
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm"
                                value={editUser.email}
                                disabled
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="edit-storage-limit">
                                Storage limit (B)
                            </label>
                            <input
                                id="edit-storage-limit"
                                type="number"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
                                value={editStorageLimit}
                                onChange={e =>
                                    setEditStorageLimit(e.target.value === '' ? '' : Number(e.target.value) || '')
                                }
                                min={0}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                type="button"
                                onClick={() => setEditUser(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                type="submit"
                                isLoading={updateUserMutation.isPending}
                                value="Save"
                            />
                        </div>
                    </form>
                </Offcanvas>
            )}

            {detailUser && (
                <Offcanvas
                    id="detail-admin-user-offcanvas"
                    title="Account details"
                    alignment="right"
                    width="50"
                    open={Boolean(detailUser)}
                    onOpenChange={open => {
                        if (!open) {
                            setDetailUser(null)
                        }
                    }}
                >
                    <div className="space-y-4 text-sm">
                        <div className="space-y-3">
                            <div>
                                <div className="text-gray-500 dark:text-gray-400">Name</div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">{detailUser.name}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 dark:text-gray-400">Email</div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">{detailUser.email}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 dark:text-gray-400">Role</div>
                                <div className="font-medium text-gray-900 dark:text-gray-100">{detailUser.role}</div>
                            </div>
                        </div>

                        {typeof detailUser.storage_limit === 'number' && typeof detailUser.storage_used === 'number' && (
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Storage usage
                                </div>
                                <StorageUsage
                                    // storage_limit & storage_used are in bytes; convert to GB for display
                                    used={detailUser.storage_used / (1024 * 1024 * 1024)}
                                    total={detailUser.storage_limit / (1024 * 1024 * 1024)}
                                    precision={2}
                                    colorClassName="bg-blue-500 dark:bg-blue-400"
                                />
                            </div>
                        )}
                    </div>
                </Offcanvas>
            )}

            {deleteUsers.length > 0 && (
                <Dialog
                    id="delete-admin-user-dialog"
                    title="Delete account"
                    open={deleteDialogOpen}
                    onOpenChange={open => {
                        setDeleteDialogOpen(open)
                        if (!open) {
                            setDeleteUsers([])
                        }
                    }}
                    confirmButtonText="Delete"
                    cancelButtonText="Cancel"
                    confirmType="danger"
                    onCancel={() => {
                        if (deleteUserMutation.isPending) return
                        setDeleteDialogOpen(false)
                        setDeleteUsers([])
                    }}
                    onConfirm={async () => {
                        if (deleteUsers.length === 0) return

                        // Xoá lần lượt để tránh treo do nhiều mutate song song trên cùng một mutation
                        for (const user of deleteUsers) {
                            // mutateAsync có sẵn từ React Query
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            await (deleteUserMutation as any).mutateAsync(user.user_id)
                        }

                        await refetch()
                        setHasSelection(false)
                    }}
                >
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {deleteUsers.length === 1 ? (
                            <>
                                Are you sure you want to delete account{' '}
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {deleteUsers[0].name}
                                </span>
                                ?
                            </>
                        ) : (
                            <>
                                Are you sure you want to delete{' '}
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {deleteUsers.length}
                                </span>{' '}
                                selected accounts?
                            </>
                        )}
                    </p>
                </Dialog>
            )}
        </div>
    )
}

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAlert } from '@/components/Alert'
import { useInfiniteUsers, useUserDetail, useUserStorageUsage } from '@/api/features/users/users.queries'
import { useCreateUser, useUpdateUser, useDeleteUser, useUpdateUserRole } from '@/api/features/users/users.mutations'
import { getProfile } from '@/api/features/auth/auth.api'
import { qk } from '@/api/query/keys'
import type { AdminUserItem, AdminUsersSuccess } from '@/api/features/users/users.types'

export type TableUser = AdminUserItem & {
  id: number
}

export function useUserManagement() {
  const { showAlert } = useAlert()

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [hasSelection, setHasSelection] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState<TableUser | null>(null)
  const [detailUserId, setDetailUserId] = useState<number | null>(null)
  const [roleDialogUser, setRoleDialogUser] = useState<TableUser | null>(null)
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [deleteUsers, setDeleteUsers] = useState<TableUser[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: currentUser } = useQuery({
    queryKey: qk.auth.profile(),
    queryFn: getProfile,
  })

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteUsers({ search: debouncedSearch.trim() || undefined }, 10)

  const { data: userDetail, isLoading: isLoadingDetail } = useUserDetail(detailUserId ?? undefined)
  const { data: storageUsage, isLoading: isLoadingStorage } = useUserStorageUsage(detailUserId ?? undefined)

  const apiPages = (data?.pages ?? []) as AdminUsersSuccess[]
  const users: AdminUserItem[] = apiPages.flatMap(page => page.data)
  const tableUsers: TableUser[] = useMemo(
    () => users.map(user => ({ ...user, id: user.user_id })),
    [users],
  )

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
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const createMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()
  const updateRoleMutation = useUpdateUserRole()

  const handleCreate = useCallback(async (name: string, email: string, password: string, role: 'user' | 'admin') => {
    try {
      await createMutation.mutateAsync({ name, email, password, role })
      showAlert({
        type: 'success',
        heading: 'User created',
        message: `User "${name}" has been created successfully.`,
        duration: 4000,
      })
      setCreateOpen(false)
      refetch()
    } catch (error: any) {
      showAlert({
        type: 'error',
        heading: 'Create failed',
        message: error.message || 'Failed to create user. Please try again.',
        duration: 4000,
      })
      throw error
    }
  }, [createMutation, showAlert, refetch])

  const handleUpdate = useCallback(async (userId: number, name: string, storageLimit: number | undefined) => {
    try {
      await updateUserMutation.mutateAsync({ userId, name, storage_limit: storageLimit })
      showAlert({
        type: 'success',
        heading: 'User updated',
        message: 'User has been updated successfully.',
        duration: 4000,
      })
      setEditUser(null)
      refetch()
    } catch (error: any) {
      showAlert({
        type: 'error',
        heading: 'Update failed',
        message: error.message || 'Failed to update user. Please try again.',
        duration: 4000,
      })
      throw error
    }
  }, [updateUserMutation, showAlert, refetch])

  const handleDelete = useCallback(async (userIds: number[]) => {
    try {
      for (const userId of userIds) {
        await (deleteUserMutation as any).mutateAsync(userId)
      }
      showAlert({
        type: 'success',
        heading: 'User deleted',
        message: `${userIds.length} user${userIds.length > 1 ? 's' : ''} has been deleted successfully.`,
        duration: 4000,
      })
      setDeleteDialogOpen(false)
      setDeleteUsers([])
      setHasSelection(false)
      refetch()
    } catch (error: any) {
      showAlert({
        type: 'error',
        heading: 'Delete failed',
        message: error.message || 'Failed to delete user. Please try again.',
        duration: 4000,
      })
      throw error
    }
  }, [deleteUserMutation, showAlert, refetch])

  const handleChangeRole = useCallback(async (userId: number, role: 'user' | 'admin') => {
    try {
      await updateRoleMutation.mutateAsync({ userId, role })
      showAlert({
        type: 'success',
        heading: 'Role updated',
        message: 'User role has been updated successfully.',
        duration: 4000,
      })
      setRoleDialogOpen(false)
      setRoleDialogUser(null)
      refetch()
    } catch (error: any) {
      showAlert({
        type: 'error',
        heading: 'Update failed',
        message: error.message || 'Failed to update role. Please try again.',
        duration: 4000,
      })
      throw error
    }
  }, [updateRoleMutation, showAlert, refetch])

  const openDetail = useCallback((user: TableUser) => {
    setDetailUserId(user.user_id)
  }, [])

  const closeDetail = useCallback(() => {
    setDetailUserId(null)
  }, [])

  const canDeleteUser = useCallback((user: TableUser) => {
    return currentUser?.user_id !== user.user_id
  }, [currentUser])

  const canChangeRole = useCallback((user: TableUser) => {
    return currentUser?.user_id !== user.user_id
  }, [currentUser])

  return {
    search,
    setSearch,
    debouncedSearch,
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
    currentUser,
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
  }
}


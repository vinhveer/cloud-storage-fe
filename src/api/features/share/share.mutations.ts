import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createShare, deleteShare, removeShareUser, addShareUsers } from './share.api'
import type { CreateShareRequest, CreateShareSuccess, DeleteShareSuccess, RemoveShareUserSuccess, AddShareUsersSuccess } from './share.types'
import type { AppError } from '../../core/error'

export function useCreateShare() {
  const queryClient = useQueryClient()
  return useMutation<CreateShareSuccess, AppError, CreateShareRequest>({
    mutationFn: createShare,
    onSuccess: (_, variables) => {
      // Invalidate specific queries for better performance
      queryClient.invalidateQueries({ queryKey: ['shares'] })
      queryClient.invalidateQueries({ 
        queryKey: ['share-by-resource', variables.shareable_type, variables.shareable_id] 
      })
    },
  })
}

export type DeleteShareVariables = {
  id: number
}

export function useDeleteShare() {
  const queryClient = useQueryClient()
  return useMutation<DeleteShareSuccess, AppError, DeleteShareVariables>({
    mutationFn: variables => deleteShare(variables.id),
    onSuccess: () => {
      // Invalidate general shares list and all resource-specific queries
      queryClient.invalidateQueries({ queryKey: ['shares'] })
      queryClient.invalidateQueries({ queryKey: ['share-by-resource'] })
    },
  })
}

export type RemoveShareUserVariables = {
  shareId: number
  userId: number
}

export function useRemoveShareUser() {
  const queryClient = useQueryClient()
  return useMutation<RemoveShareUserSuccess, AppError, RemoveShareUserVariables>({
    mutationFn: variables => removeShareUser(variables.shareId, variables.userId),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['share-by-resource'] })
      
      // Snapshot the previous value
      const previousShareData = queryClient.getQueriesData({ queryKey: ['share-by-resource'] })
      
      // Optimistically update share-by-resource queries
      queryClient.setQueriesData(
        { queryKey: ['share-by-resource'] },
        (old: any) => {
          if (!old || !old.share_id) return old
          
          // Remove user from shared_with array
          return {
            ...old,
            shared_with: old.shared_with.filter((user: any) => user.user_id !== variables.userId),
          }
        }
      )
      
      return { previousShareData }
    },
    onError: (_err, _variables, context: any) => {
      // Rollback on error
      if (context?.previousShareData) {
        context.previousShareData.forEach(([queryKey, queryData]: [any, any]) => {
          queryClient.setQueryData(queryKey, queryData)
        })
      }
    },
    onSuccess: () => {
      // Invalidate general shares list and all resource-specific queries
      queryClient.invalidateQueries({ queryKey: ['shares'] })
      queryClient.invalidateQueries({ queryKey: ['share-by-resource'] })
    },
  })
}

export type AddShareUsersVariables = {
  shareId: number
  userIds: number[]
  permission: string
  userInfo?: { user_id: number; name: string }[] // For optimistic updates
}

export function useAddShareUsers() {
  const queryClient = useQueryClient()
  return useMutation<AddShareUsersSuccess, AppError, AddShareUsersVariables>({
    mutationFn: variables => addShareUsers(variables.shareId, {
      user_ids: variables.userIds,
      permission: variables.permission,
    }),
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['share-by-resource'] })
      
      // Snapshot the previous value
      const previousShareData = queryClient.getQueriesData({ queryKey: ['share-by-resource'] })
      
      // Optimistically update share-by-resource queries
      queryClient.setQueriesData(
        { queryKey: ['share-by-resource'] },
        (old: any) => {
          if (!old || !old.share_id) return old
          
          // Add new users to the shared_with array with actual names
          const newUsers = variables.userInfo?.map(user => ({
            user_id: user.user_id,
            name: user.name,
            permission: variables.permission,
          })) || variables.userIds.map(userId => ({
            user_id: userId,
            name: `User ${userId}`, // Fallback temporary name
            permission: variables.permission,
          }))
          
          return {
            ...old,
            shared_with: [...old.shared_with, ...newUsers],
          }
        }
      )
      
      return { previousShareData }
    },
    onError: (_err, _variables, context: any) => {
      // Rollback on error
      if (context?.previousShareData) {
        context.previousShareData.forEach(([queryKey, queryData]: [any, any]) => {
          queryClient.setQueryData(queryKey, queryData)
        })
      }
    },
    onSuccess: () => {
      // Invalidate general shares list and all resource-specific queries
      queryClient.invalidateQueries({ queryKey: ['shares'] })
      queryClient.invalidateQueries({ queryKey: ['share-by-resource'] })
    },
  })
}


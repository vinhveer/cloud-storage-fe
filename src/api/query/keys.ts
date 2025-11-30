import type { ListParams } from '../core/types'

export const qk = {
  auth: {
    root: () => ['auth'] as const,
    profile: () => ['auth', 'profile'] as const,
  },
  admin: {
    root: () => ['admin'] as const,
    dashboard: () => ['admin-dashboard', 'overview'] as const,
    statsUsers: () => ['admin', 'stats', 'users'] as const,
    statsFiles: () => ['admin', 'stats', 'files'] as const,
    statsStorage: (params?: { start_date?: string; end_date?: string }) =>
      ['admin', 'stats', 'storage', params ?? {}] as const,
    storageOverview: () => ['admin', 'storage', 'overview'] as const,
    storageUsers: (params?: ListParams) => ['admin', 'storage', 'users', params ?? {}] as const,
    users: (params?: ListParams) => ['admin', 'users', params ?? {}] as const,
    userById: (userId: string) => ['admin', 'user', userId] as const,
    userDelete: (userId: string) => ['admin', 'user', userId, 'delete'] as const,
    userStorageUsage: (userId: string) => ['admin', 'user', userId, 'storage-usage'] as const,
  },
  userDashboard: {
    root: () => ['user-dashboard'] as const,
    overview: () => ['user-dashboard', 'overview'] as const,
    stats: (params?: { start_date?: string; end_date?: string }) =>
      ['user-dashboard', 'stats', params ?? {}] as const,
  },
  config: {
    root: () => ['config'] as const,
    list: (params?: ListParams) => ['configs', params ?? {}] as const,
  },
  user: {
    root: () => ['user'] as const,
    byId: (userId: string) => ['user', userId] as const,
    list: (params?: ListParams) => ['users', params ?? {}] as const,
  },
  file: {
    root: () => ['file'] as const,
    byId: (fileId: string) => ['file', fileId] as const,
    list: (params?: ListParams) => ['files', params ?? {}] as const,
  },
  folders: {
    root: () => ['folders'] as const,
    byId: (folderId: number | string) => ['folder', folderId] as const,
    contents: (folderId: number | string) => ['folder', folderId, 'contents'] as const,
    breadcrumb: (folderId: number | string) => ['folder', folderId, 'breadcrumb'] as const,
    list: (params?: ListParams) => ['folders', params ?? {}] as const,
  },
} as const



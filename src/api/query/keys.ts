import type { ListParams } from '../core/types'

export const qk = {
  auth: {
    root: () => ['auth'] as const,
    profile: () => ['auth', 'profile'] as const,
  },
  admin: {
    root: () => ['admin'] as const,
    dashboard: () => ['admin', 'dashboard'] as const,
    statsUsers: () => ['admin', 'stats', 'users'] as const,
    statsFiles: () => ['admin', 'stats', 'files'] as const,
    statsStorage: (params?: { start_date?: string; end_date?: string }) =>
      ['admin', 'stats', 'storage', params ?? {}] as const,
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
} as const



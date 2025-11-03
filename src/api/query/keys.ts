import type { ListParams } from '../core/types'

export const qk = {
  auth: {
    root: () => ['auth'] as const,
    profile: () => ['auth', 'profile'] as const,
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



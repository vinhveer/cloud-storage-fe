import React from 'react'
import { redirect } from '@tanstack/react-router'
import { getAccessToken } from '@/api/core/auth-key'

export type Access = 'public' | 'guestOnly' | 'protected'

export function getSession() {
  const token = getAccessToken()
  return { isAuthed: Boolean(token) }
}

export function ensureAccess(access: Access, ctx?: any) {
  const { isAuthed } = getSession()
  if (access === 'protected' && !isAuthed) {
    throw redirect({ to: '/auth/login', search: { from: ctx?.location?.href } })
  }
  if (access === 'guestOnly' && isAuthed) {
    throw redirect({ to: '/' })
  }
}

export function pickVariant<T extends React.ComponentType<any>>(variants: { guest?: T; authed?: T }) {
  const { isAuthed } = getSession()
  return isAuthed ? variants.authed ?? variants.guest! : variants.guest ?? variants.authed!
}



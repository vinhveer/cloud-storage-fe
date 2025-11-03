import React from 'react'
import { createRoute, type RouteOptions } from '@tanstack/react-router'
import { ensureAccess, pickVariant, type Access } from './access'

type WithAccess<T> = T & {
  access: Access
  variants?: { guest?: React.ComponentType; authed?: React.ComponentType }
}

export function createAccessRoute<TOpts extends RouteOptions<any, any>>(
  opts: WithAccess<TOpts>,
) {
  const { access, variants, component, beforeLoad, ...rest } = opts as any
  const comp = variants
    ? () => {
        const Cmp = pickVariant(variants)
        return React.createElement(Cmp)
      }
    : component

  const mergedBeforeLoad = (ctx: any) => {
    ensureAccess(access, ctx)
    return beforeLoad?.(ctx)
  }

  return createRoute({
    ...rest,
    component: comp,
    beforeLoad: mergedBeforeLoad,
  })
}



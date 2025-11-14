import { createAccessRoute } from '../route-factories'
import SamplesPage from '@/app/pages/samples'
import SampleDynamicPage from '@/app/pages/samples/[slug]'
import { rootRoute } from '../root'
import NoLayout from '@/app/layout/NoLayout'

export function getSamplesRoutes(parent?: ReturnType<typeof createAccessRoute> | typeof rootRoute) {
  const parentRoute = parent ?? rootRoute
  const samplesRoute = createAccessRoute({
    getParentRoute: () => parentRoute,
    path: 'samples',
    component: NoLayout,
    access: 'public',
  })

  const samplesIndexRoute = createAccessRoute({
    getParentRoute: () => samplesRoute,
    path: '/',
    component: SamplesPage,
    access: 'public',
  })

  const dynamicMdxRoute = createAccessRoute({
    getParentRoute: () => samplesRoute,
    path: '$slug',
    component: SampleDynamicPage,
    access: 'public',
  })

  const nestedMdxRoute = createAccessRoute({
    getParentRoute: () => samplesRoute,
    path: '$parent/$child',
    component: SampleDynamicPage,
    access: 'public',
  })

  return samplesRoute.addChildren([
    samplesIndexRoute,
    dynamicMdxRoute,
    nestedMdxRoute,
  ])
}
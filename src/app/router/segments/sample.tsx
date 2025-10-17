import { createRoute } from '@tanstack/react-router'
import SamplesPage from '@/pages/samples'
import SampleDynamicPage from '@/pages/samples/[slug]'
import { rootRoute } from '../root'

export function getSamplesRoutes() {
  const samplesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/samples',
  })

  const samplesIndexRoute = createRoute({
    getParentRoute: () => samplesRoute,
    path: '/',
    component: SamplesPage,
  })

  const dynamicMdxRoute = createRoute({
    getParentRoute: () => samplesRoute,
    path: '$slug',
    component: SampleDynamicPage,
  })

  const nestedMdxRoute = createRoute({
    getParentRoute: () => samplesRoute,
    path: '$parent/$child',
    component: SampleDynamicPage,
  })

  return samplesRoute.addChildren([
    samplesIndexRoute,
    dynamicMdxRoute,
    nestedMdxRoute,
  ])
}
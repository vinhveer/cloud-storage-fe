import { createRoute } from '@tanstack/react-router'
import SamplesPage from '@/pages/Samples'
// Legacy sample pages removed in favor of MDX-based pages
import SampleDynamicPage from '@/pages/samples/[slug]'
import SampleLayout from '@/app/layout/SampleLayout'
import { rootRoute } from '../root'

export function getSamplesRoutes() {
  const samplesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/samples',
    component: SampleLayout,
  })

  const samplesIndexRoute = createRoute({
    getParentRoute: () => samplesRoute,
    path: '/',
    component: SamplesPage,
  })

  // legacy routes removed

  const dynamicMdxRoute = createRoute({
    getParentRoute: () => samplesRoute,
    path: '$slug',
    component: SampleDynamicPage,
  })

  return samplesRoute.addChildren([
    samplesIndexRoute,
    dynamicMdxRoute,
  ])
}

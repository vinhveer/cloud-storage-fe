import { createAccessRoute } from '../route-factories'
import { rootRoute } from '../root'
import AppLayout from '@/app/layout/AppLayout'
import MyFilesPage from '@/app/pages/my-files'
import SharedPage from '@/app/pages/shared'
import TrashPage from '@/app/pages/trash'
import PublicLinksPage from '@/app/pages/public-links'

function buildSection(path: string, Page: React.ComponentType) {
  const sectionRoute = createAccessRoute({
    getParentRoute: () => rootRoute,
    path,
    component: AppLayout,
    access: 'protected',
  })

  const sectionIndex = createAccessRoute({
    getParentRoute: () => sectionRoute,
    path: '/',
    component: () => <Page />,
    access: 'protected',
  })

  return sectionRoute.addChildren([sectionIndex])
}

export function getStorageRoutes() {
  return [
    buildSection('/my-files', MyFilesPage),
    buildSection('/shared', SharedPage),
    buildSection('/trash', TrashPage),
    buildSection('/public-links', PublicLinksPage),
  ]
}



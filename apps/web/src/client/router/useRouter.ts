import { generatePath, useNavigate } from 'react-router-dom'
import { routes } from '@/client/router/routes'
import type { FilterKeys } from '@/client/utils/tsc'

export function useRouter() {
  const navigate = useNavigate()

  return {
    navigateToProject: ({ id }: { id: string }) =>
      navigate(generatePath(routes.projectOverview.path, { projectId: id })),
    navigateToProjectQuotes: ({ id }: { id: string }) =>
      navigate(generatePath(routes.projectQuotes.path, { projectId: id })),
    navigateToProjects: () => navigate(routes.projects.path),
    navigateToAddProjects: () => navigate(routes.addProjects.path),
    navigateToAddQuote: ({ projectId }: { projectId: string }) =>
      navigate(generatePath(routes.addQuote.path, { projectId })),
    navigateToEditQuote: ({ quoteId }: { quoteId: string }) =>
      navigate(generatePath(routes.updateQuote.path, { quoteId })),
    navigateToHome: () => navigate(routes.home.path),
    navigateToAbout: () => navigate(routes.about.path),
    navigateToSettings: () => navigate(routes.settings.path),
    navigateTo: (route: RouteWithPath) => navigate(routes[route].path),
    navigateToPath: (path: string) => navigate(path),
  }
}

type RouteWithPath = FilterKeys<typeof routes, { path: string }>

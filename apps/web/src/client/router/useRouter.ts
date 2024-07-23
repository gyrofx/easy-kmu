import { generatePath, useNavigate } from 'react-router-dom'
import { routes } from '@/client/router/routes'
import type { FilterKeys } from '@/client/utils/tsc'

export function useRouter() {
  const navigate = useNavigate()

  return {
    navigateToProject: ({ id }: { id: string }) => navigate(generatePath(routes.project.path, { id })),
    navigateToProjects: () => navigate(routes.projects.path),
    navigateToAddProjects: () => navigate(routes.addProjects.path),
    navigateToHome: () => navigate(routes.home.path),
    navigateToAbout: () => navigate(routes.about.path),
    navigateToSettings: () => navigate(routes.settings.path),
    navigateTo: (route: RouteWithPath) => navigate(routes[route].path),
    navigateToPath: (path: string) => navigate(path),
  }
}

type RouteWithPath = FilterKeys<typeof routes, { path: string }>

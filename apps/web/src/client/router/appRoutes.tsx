import { AppRoot } from '@/client/AppRoot'
import { CreateInvoiceForm } from '@/client/domain/invoice/CreateInvoice'
import { routes } from '@/client/router/routes'
import { ErrorBoundary } from '@/client/utils/ErrorBoundary'
import { Link, Navigate } from 'react-router-dom'
// import { useAuth0 } from '@auth0/auth0-react'
// import { LinearProgress } from '@mui/material'
import { Contacts } from '@/client/domain/contacts/Contacts'
import { ProjectObjects } from '@/client/domain/projectObjects/ProjectObjects'
import { Projects } from '@/client/domain/projects/Projects'
import { AddProjects } from '@/client/domain/projects/AddProjects'
import { ProjectView } from '@/client/domain/projects/Project'
import { Typography } from '@mui/material'

export function appRoutes() {
  return [
    {
      ...routes.home,
      element: (
        <ErrorBoundary>
          <AppRoot />
        </ErrorBoundary>
      ),
      handle: {
        // you can put whatever you want on a route handle
        // here we use "crumb" and return some elements,
        // this is what we'll render in the breadcrumbs
        // for this route
        crumb: () => <Link to="/">Home</Link>,
      },
      children: [
        {
          ...routes.invoice,
          element: <CreateInvoiceForm />,
        },
        {
          ...routes.contacts,
          element: <Contacts />,
        },
        {
          ...routes.objects,
          element: <ProjectObjects />,
        },
        {
          ...routes.projects,
          element: <Projects />,
          handle: {
            crumb: () => <Typography variant="body1">Projekte</Typography>,
          },
        },
        {
          ...routes.project,
          element: <ProjectView />,
          handle: {
            crumb: () => <Link to={routes.projects.path}>Projekte</Link>,
          },
        },
        {
          ...routes.addProjects,
          element: <AddProjects />,
          handle: {
            crumb: () => [
              // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
              <Link to={routes.projects.path}>Projekte</Link>,
              // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
              <Typography variant="body1">Projekte hinzufügen</Typography>,
            ],
          },
        },
        {
          ...routes.about,
          element: <div>About</div>,
        },
        {
          ...routes.settings,
          element: <div>Settings</div>,
        },
      ],
    },
    { path: '*', element: <Navigate to="/summary" /> },
  ]
}

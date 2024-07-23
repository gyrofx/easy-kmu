import { AppRoot } from '@/client/AppRoot'
import { CreateInvoiceForm } from '@/client/domain/invoice/CreateInvoice'
import { routes } from '@/client/router/routes'
import { ErrorBoundary } from '@/client/utils/ErrorBoundary'
import { Navigate } from 'react-router-dom'
// import { useAuth0 } from '@auth0/auth0-react'
// import { LinearProgress } from '@mui/material'
import { Contacts } from '@/client/domain/contacts/Contacts'
import { ProjectObjects } from '@/client/domain/projectObjects/ProjectObjects'
import { Projects } from '@/client/domain/projects/Projects'
import { AddProjects } from '@/client/domain/projects/AddProjects'

export function appRoutes() {
  return [
    {
      ...routes.home,
      element: (
        <ErrorBoundary>
          <AppRoot />
        </ErrorBoundary>
      ),
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
        },
        {
          ...routes.addProjects,
          element: <AddProjects />,
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

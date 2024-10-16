import { AppRoot } from '@/client/AppRoot'
import { routes } from '@/client/router/routes'
import { ErrorBoundary } from '@/client/utils/ErrorBoundary'
import { Link, Navigate, type RouteObject } from 'react-router-dom'
// import { useAuth0 } from '@auth0/auth0-react'
// import { LinearProgress } from '@mui/material'
import { Contacts } from '@/client/domain/contacts/Contacts'
import { ProjectObjects } from '@/client/domain/projectObjects/ProjectObjects'
import { Projects } from '@/client/domain/projects/Projects'
import { CreateProjectView, UpdateProjectView } from '@/client/domain/projects/AddProjects'
import { ProjectView } from '@/client/domain/projects/Project'
import { Typography } from '@mui/material'
import { Quotes } from '@/client/domain/quotes/Quotes'
import { CreateQuoteView, UpdateQuoteView } from '@/client/domain/quotes/CreateOrUpdateQuote'
import { ProjectOverview } from '@/client/domain/projects/ProjectOverview'
import { Tasks } from '@/client/domain/tasks/Tasks'
import { Materials } from '@/client/domain/material/Materials'
import { RootRoute } from '@/client/App'
import { SignIn } from '@/client/auth/SignIn'
import { MyWorkingTimes } from '@/client/domain/workingTimes/MyWorkingTimes'

export function appRoutes(): RouteObject[] {
  return [
    {
      ...routes.home,
      element: (
        <ErrorBoundary>
          <RootRoute />
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
          ...routes.addProjects,
          element: <CreateProjectView />,
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
          ...routes.updateProject,
          element: <UpdateProjectView />,
        },
        {
          ...routes.project,
          element: <ProjectView />,
          handle: {
            crumb: () => <Link to={routes.projects.path}>Projekte</Link>,
          },
          children: [
            {
              ...routes.projectOverview,
              element: <ProjectOverview />,
            },
            {
              ...routes.projectQuotes,
              element: <Quotes />,
            },
            {
              ...routes.tasks,
              element: <Tasks />,
            },
            {
              ...routes.projectInvoices,
              element: <div>Rechnungen</div>,
            },
          ],
        },
        {
          ...routes.addQuote,
          element: <CreateQuoteView />,
        },
        {
          ...routes.updateQuote,
          element: <UpdateQuoteView />,
        },
        { ...routes.materials, element: <Materials /> },
        { ...routes.myWorkingTimes, element: <MyWorkingTimes /> },

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
    { ...routes.signIn, element: <SignIn /> },
  ]
}

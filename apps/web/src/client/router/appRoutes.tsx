import { AppRoot } from '@/client/AppRoot'
import { CreateInvoiceForm } from '@/client/invoice/CreateInvoice'
import { routes } from '@/client/router/routes'
import { ErrorBoundary } from '@/client/utils/ErrorBoundary'
import { Navigate } from 'react-router-dom'
// import { useAuth0 } from '@auth0/auth0-react'
// import { LinearProgress } from '@mui/material'
import { Contacts } from '@/client/contacts/Contacts'

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

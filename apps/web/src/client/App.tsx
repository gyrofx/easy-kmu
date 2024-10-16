import { AuthProvider } from '@/client/auth/AuthProvider'
import { useSessionStore } from '@/client/auth/useSessionStore'
import { appRoutes } from '@/client/router/appRoutes'
import { ServerInfoContextProvider } from '@/client/serverInfo/useServerInfo'
import { createMuiTheme } from '@/client/utils/createMuiTheme'
import {
  Dashboard,
  AccountTree,
  ContactPhoneOutlined,
  MapsHomeWork,
  ConstructionOutlined,
  BarChart,
  Description,
  Layers,
  QueryBuilder,
} from '@mui/icons-material'
import { createTheme } from '@mui/material'
import { AppProvider, DashboardLayout, type Navigate, type Navigation, type Router } from '@toolpad/core'
import { ConfirmProvider } from 'material-ui-confirm'
import { StrictMode, useCallback, useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { setDefaultOptions } from 'date-fns'
import { de } from 'date-fns/locale'

const queryClient = new QueryClient()

const createRouter = () => createBrowserRouter(appRoutes())

setDefaultOptions({ locale: de, weekStartsOn: 1 })

export function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ServerInfoContextProvider>
          <AuthProvider>
            <ConfirmProvider>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <RouterProvider router={createRouter()} />
              </LocalizationProvider>
            </ConfirmProvider>
          </AuthProvider>
        </ServerInfoContextProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

export function RootRoute() {
  const router = useRouterIntergration()
  const { session, signIn, signOut } = useSessionStore()
  console.log('RootRoute', { session })
  const authentication = useMemo(() => ({ signIn, signOut }), [signIn, signOut])

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      theme={theme}
      branding={{
        logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
        title: 'MUI',
      }}
      router={router}
      // authentication={AUTHENTICATION}
      // session={session}
    >
      <DashboardLayout>
        {/* <DemoPageContent pathname={pathname} /> */}
        {/* <PageContainer sx={{ width: '100%' }}> */}
        <Outlet />
        {/* </PageContainer> */}
      </DashboardLayout>
    </AppProvider>
  )
}

const baseTheme = createTheme({})
const theme = createMuiTheme(baseTheme, {
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          [baseTheme.breakpoints.up('lg')]: {
            maxWidth: '100%',
          },

          // Note that you can customize other properties here, like padding, color, .etc.
        },
      },
    },
  },
})

function useRouterIntergration() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const navigateImpl = useCallback<Navigate>(
    (url, { history = 'auto' } = {}) => {
      if (history === 'auto' || history === 'push') {
        return navigate(url)
      }
      if (history === 'replace') {
        return navigate(url, { replace: true })
      }
      throw new Error(`Invalid history option: ${history}`)
    },
    [navigate],
  )

  const routerImpl = useMemo<Router>(
    () => ({
      pathname,
      searchParams,
      navigate: navigateImpl,
    }),
    [pathname, searchParams, navigateImpl],
  )

  return routerImpl
}

const NAVIGATION: Navigation = [
  {
    segment: '',
    title: 'Home',
    icon: <Dashboard />,
  },
  {
    kind: 'page',
    // segment: '/',
    segment: 'projects',
    title: 'Projekte',
    icon: <AccountTree />,

    // children: [
    //   {
    //     title: 'Alle',
    //     icon: <Add />,
    //   },
    //   {
    //     segment: 'add-projects',
    //     title: 'Neues Projekt',
    //     icon: <Add />,
    //   },
    // ],
  },
  {
    segment: 'contacts',
    title: 'Kontakte',
    icon: <ContactPhoneOutlined />,
  },
  {
    segment: 'objects',
    title: 'Objekte',
    icon: <MapsHomeWork />,
  },
  {
    segment: 'materials',
    title: 'Material',
    icon: <ConstructionOutlined />,
  },
  { kind: 'divider' },
  {
    segment: 'working-times',
    title: 'Arbeitszeiten',
    icon: <QueryBuilder />,
  },
  {
    segment: 'my-working-times',
    title: 'Meine Arbeitszeiten',
    icon: <QueryBuilder />,
  },
  { kind: 'divider' },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <BarChart />,
    children: [
      {
        segment: 'sales',
        title: 'Sales',
        icon: <Description />,
      },
      {
        segment: 'traffic',
        title: 'Traffic',
        icon: <Description />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <Layers />,
  },
]

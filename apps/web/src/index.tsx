import { CssBaseline } from '@mui/material'
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from '@/client/auth/AuthProvider'
import './index.css'
import { ServerInfoContextProvider } from '@/client/serverInfo/useServerInfo'
import { appRoutes } from '@/client/router/appRoutes'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

const queryClient = new QueryClient()

const createRouter = () => createBrowserRouter(appRoutes())

let theme = createTheme()
theme = responsiveFontSizes(theme)

const container = document.getElementById('root')
if (!container) throw new Error('No container element')
const root = createRoot(container)

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ServerInfoContextProvider>
        <AuthProvider>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <RouterProvider router={createRouter()} />
          </ThemeProvider>
        </AuthProvider>
      </ServerInfoContextProvider>
    </QueryClientProvider>
  </StrictMode>,
)

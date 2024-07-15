import { AppBar } from '@/client/appBar/AppBar'
import { AppBreadcrumbs } from '@/client/appBar/AppBreadcrumb'
import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function AppRoot() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar />

      <AppBreadcrumbs />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth={false} sx={{ flexGrow: 1 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}

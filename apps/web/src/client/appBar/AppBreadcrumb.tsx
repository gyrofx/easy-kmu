import { Breadcrumbs, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export function AppBreadcrumbs() {
  return (
    <Breadcrumbs sx={{ my: 2, mx: 2 }} aria-label="breadcrumb">
      <Link to={'/'}>Home</Link>
      <Link to={'/'}>Core</Link>
      <Typography color="text.primary">Breadcrumbs</Typography>
    </Breadcrumbs>
  )
}

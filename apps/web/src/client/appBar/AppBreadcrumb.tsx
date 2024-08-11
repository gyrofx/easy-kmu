import { Breadcrumbs, Typography } from '@mui/material'
import { Link, useMatches } from 'react-router-dom'

export function AppBreadcrumbs() {
  // const matches = useMatches()
  // const crumbs = matches
  //   // first get rid of any matches that don't have handle and crumb
  //   .filter((match) => Boolean(match.handle?.crumb))
  //   // now map them into an array of elements, passing the loader
  //   // data to each one
  //   .flatMap((match) => {
  //     const c = match.handle.crumb(match.data)
  //     console.log('c', c)
  //     return c
  //   })

  // return (
  //   <Breadcrumbs sx={{ my: 2, mx: 2 }} aria-label="breadcrumb">
  //     {/* <Link to={'/'}>Home</Link> */}
  //     {/* <Link to={'/'}>Core</Link> */}
  //     {/* <Typography color="text.primary">Breadcrumbs</Typography> */}

  //     {crumbs}
  //   </Breadcrumbs>
  // )

  return (
    <Breadcrumbs sx={{ my: 2, mx: 2 }} aria-label="breadcrumb">
      <Link to={'/'}>Home</Link>
      <Link to={'/projects'}>Projects</Link>
    </Breadcrumbs>
  )
}

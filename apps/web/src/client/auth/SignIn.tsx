import { Grid2 as Grid, Button, Typography } from '@mui/material'

export function SignIn() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}
    >
      <Grid size={{ xs: 3 }}>
        <Typography variant="h1">Login</Typography>
        <LoginButton />
      </Grid>
    </Grid>
  )
}

const LoginButton = () => {
  return (
    <Button
      onClick={() => {
        window.location.href = '/auth/signin'
      }}
    >
      Log In
    </Button>
  )
}

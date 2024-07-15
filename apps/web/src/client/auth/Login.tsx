import { Box, Button, Typography } from '@mui/material'

export function Login() {
  return (
    <Box>
      <Typography variant="h1">Login</Typography>
      <LoginButton />
    </Box>
  )
}

const LoginButton = () => {
  return (
    <Button
      onClick={() => {
        window.location.href = '/auth/login'
      }}
    >
      Log In
    </Button>
  )
}

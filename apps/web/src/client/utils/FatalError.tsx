import { Container, Typography, useTheme } from '@mui/material'
import { DisplayError } from '@/client/utils/DisplayError'

interface FatalErrorProps {
  message: string | React.ReactNode
  error: Error | undefined
}

export function FatalError({ message, error }: FatalErrorProps) {
  const theme = useTheme()

  if (!error) return null

  console.error('Error was displayed to a customer', error)

  return (
    <Container disableGutters sx={{ height: '100%' }}>
      <Typography component={'span'} color={theme.palette.error.dark} sx={{ m: 1 }}>
        {message}
      </Typography>

      <DisplayError error={error} consoleError={console.error} />
    </Container>
  )
}

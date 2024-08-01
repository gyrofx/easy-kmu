import { useRouter } from '@/client/router/useRouter'
import { Box, Button } from '@mui/material'
import { useParams } from 'react-router-dom'

export function Quotes() {
  const { navigateToAddQuote } = useRouter()
  const { projectId } = useParams()

  if (!projectId) return <h1>Project ID is missing</h1>

  return (
    <Box>
      <h1>Quotes</h1>
      <Button onClick={() => navigateToAddQuote({ projectId })}>Add Quote</Button>
    </Box>
  )
}

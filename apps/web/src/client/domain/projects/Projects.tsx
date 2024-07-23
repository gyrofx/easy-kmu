import { apiClient } from '@/client/api/client'
import { useRouter } from '@/client/router/useRouter'
import { Box, Button, Card } from '@mui/material'
import { useQuery } from 'react-query'

export function Projects() {
  const { navigateToAddProjects, navigateToProject } = useRouter()
  const query = useQuery({ queryKey: ['projects'], queryFn: apiClient.listProjects })

  return (
    <>
      <div>Projects</div>
      <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', width: '200px' }}>
        <Button variant="outlined" color="primary" onClick={navigateToAddProjects}>
          Add Project
        </Button>

        <Button sx={{ my: 1 }} variant="outlined" color="primary" onClick={navigateToProject}>
          Go to Project
        </Button>
      </Box>
      <Card>{JSON.stringify(query.data, null, 2)}</Card>
    </>
  )
}

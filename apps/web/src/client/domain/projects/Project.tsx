import { useRouter } from '@/client/router/useRouter'
import { Button } from '@mui/material'

export function Project() {
  const { navigateToProjects } = useRouter()
  return (
    <>
      <div>Project XY</div>
      <Button variant="outlined" color="primary" onClick={navigateToProjects}>
        All Project
      </Button>
    </>
  )
}

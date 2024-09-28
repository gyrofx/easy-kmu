import { useProjectQuery } from '@/client/domain/projects/useProjectQuery'
import { Box, IconButton, LinearProgress, Tab, Tabs, Typography } from '@mui/material'
import { Link, Outlet, useMatches, useParams } from 'react-router-dom'
import { last } from 'lodash'
import { routes } from '@/client/router/routes'
import { Edit } from '@mui/icons-material'
import { useRouter } from '@/client/router/useRouter'

function useRouteId() {
  const matches = useMatches()
  if (!matches || !matches.length) return undefined
  return last(matches)?.id
}

export function ProjectView() {
  const { navigateToEditProject } = useRouter()
  const { projectId } = useParams()
  const projectQuery = useProjectQuery(projectId ? projectId : '')

  const currentTab = useRouteId()

  if (projectQuery.isLoading) return <LinearProgress />
  if (projectQuery.isError) return <div>Error</div>

  const project = projectQuery.data
  if (!project || !projectId) return <div>Project not found</div>

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h3" sx={{ my: 2 }}>
            {project.projectNumber} - {project.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="primary" onClick={() => navigateToEditProject({ projectId })}>
            <Edit />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab}>
          <Tab
            label="Übersicht"
            value={routes.projectOverview.id}
            to={`/project/${project.id}/overview`}
            component={Link}
          />
          <Tab
            label="Offerten"
            value={routes.projectQuotes.id}
            to={`/project/${project.id}/quotes`}
            component={Link}
          />
          <Tab
            label="Aufgaben"
            value={routes.tasks.id}
            to={`/project/${project.id}/tasks`}
            component={Link}
          />
          <Tab
            label="Rechnungen"
            value={routes.projectInvoices.id}
            to={`/project/${project.id}/invoices`}
            component={Link}
          />
        </Tabs>
      </Box>

      <Outlet />
    </Box>
  )
}

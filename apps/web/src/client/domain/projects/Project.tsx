import { Box, IconButton, LinearProgress, Tab, Tabs } from '@mui/material'
import { Link, Outlet, useMatches, useParams } from 'react-router-dom'
import { last } from 'lodash'
import { routes } from '@/client/router/routes'
import { Edit } from '@mui/icons-material'
import { useRouter } from '@/client/router/useRouter'
import { Suspense } from 'react'
import { PageContainer, PageContainerToolbar } from '@toolpad/core'
import type { Project } from '@/common/models/project'
import { useProjectQuery } from '@/client/domain/projects/useProjectQuery'

function useRouteId() {
  const matches = useMatches()
  if (!matches || !matches.length) return undefined
  return last(matches)?.id
}

export function ProjectView() {
  const { projectId } = useParams()
  if (!projectId) throw new Error('missing projectId')

  const query = useProjectQuery(projectId)

  return (
    <Suspense fallback={<LinearProgress />}>
      {query.data && (
        <PageContainer
          breadCrumbs={[
            { title: 'Home', path: '/' },
            { title: 'Projekte', path: '/projects' },
            { title: query.data.name, path: '' },
          ]}
          title={`${query.data.projectNumber} - ${query.data.name}`}
          slots={{ toolbar: ProjectToolbar }}
        >
          <ProjectViewInner project={query.data} />
        </PageContainer>
      )}
    </Suspense>
  )
}

function ProjectToolbar() {
  const { navigateToEditProject } = useRouter()
  const { projectId } = useParams()
  if (!projectId) throw new Error('missing projectId')

  return (
    <PageContainerToolbar>
      <IconButton color="primary" onClick={() => navigateToEditProject({ projectId })}>
        <Edit />
      </IconButton>
    </PageContainerToolbar>
  )
}

function ProjectViewInner(props: { project: Project }) {
  const { project } = props

  const currentTab = useRouteId()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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

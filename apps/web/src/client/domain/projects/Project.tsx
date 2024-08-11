import { useProjectQuery } from '@/client/domain/projects/useProjectQuery'
import { Box, Card, CardContent, Grid, LinearProgress, Tab, Tabs, Typography } from '@mui/material'
import { Link, Outlet, useMatches, useParams } from 'react-router-dom'
import type { Project } from '@/common/models/project'
import { last } from 'lodash'
import { routes } from '@/client/router/routes'

function useRouteId() {
  const matches = useMatches()
  if (!matches || !matches.length) return undefined
  return last(matches)?.id
}

export function ProjectView() {
  const { projectId } = useParams()
  const projectQuery = useProjectQuery(projectId ? projectId : '')

  const currentTab = useRouteId()

  if (projectQuery.isLoading) return <LinearProgress />
  if (projectQuery.isError) return <div>Error</div>

  const project = projectQuery.data
  if (!project) return <div>Project not found</div>

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h3" sx={{ my: 2 }}>
            {project.projectNumber} - {project.name}
          </Typography>
          <Typography variant="body2" sx={{ my: 2 }}>
            {project.description}
          </Typography>
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

function ProjectOverview({ project }: { project: Project }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Beschreibung
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                Objekt, Projektbeschreibung, Status
              </Typography>
              <Box>{JSON.stringify(project.object)}</Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Status
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Kontakte
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Geleistete Stunden, pro Tag, Woche, Monat, Gesamt
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Offerten
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Rechnungen
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Zahlungen
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Kalkulation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

import { useProjectQuery } from '@/client/domain/projects/useProjectQuery'
import { Add, Info } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { type SyntheticEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Project } from '@/common/models/project'

export function ProjectView() {
  const { id } = useParams()
  const projectQuery = useProjectQuery(id ? id : '')

  const [value, setValue] = useState(1)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

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
        {/* <Box sx={{ display: 'flex', alignItems: 'center' }}></Box> */}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Übersicht" value="1" />
              <Tab label="Offerten" value="2" />
              <Tab label="Rechnungen" value="3" />
              <Tab label="Kalkulation" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <ProjectOverview project={project} />
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
          <TabPanel value="4">Item Three</TabPanel>
        </TabContext>
      </Box>
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

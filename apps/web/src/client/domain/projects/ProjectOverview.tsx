import { useProjectQuery } from '@/client/domain/projects/useProjectQuery'
import type { Project } from '@/common/models/project'
import type { ProjectObject } from '@/common/models/projectObject'
import { Check, House, LocationOn } from '@mui/icons-material'
import { Box, Card, CardContent, Grid, Icon, Link, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

export function ProjectOverview() {
  const { projectId } = useParams()
  const projectQuery = useProjectQuery(projectId || '')

  if (!projectId) return <h1>Project ID is missing</h1>
  if (projectQuery.isLoading) return <h1>Loading...</h1>
  if (projectQuery.error) return <h1>Error</h1>
  if (!projectQuery.data) return <h1>Project not found</h1>

  const project = projectQuery.data

  return (
    <Box sx={{ flexGrow: 1, my: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Beschreibung
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                {project.description}
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                Notizen
              </Typography>
              <Typography gutterBottom variant="body1" component="div">
                {project.notes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography gutterBottom variant="h5" component="div">
                  Status
                </Typography>
                <Typography gutterBottom variant="body1" component="div">
                  Offeriert
                </Typography>
              </Box>
              <Typography gutterBottom variant="body1" component="div">
                Offerte versendet am 17.2.2024 (10 Tage)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card>
              <CardContent>
                {project.object && (
                  <>
                    <Typography gutterBottom variant="h5" component="div">
                      Objekt
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                        <Icon>
                          <House />
                        </Icon>
                        <Typography variant="body1" component="div">
                          {project.object?.address}, {project.object?.zipCode} {project.object?.city}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                        <Icon>
                          <LocationOn />
                        </Icon>
                        <Link target="_blank" href={googleMapsLink(project.object)}>
                          Auf Google Maps anzeigen
                        </Link>
                      </Box>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
            <ContactsCard project={project} />

            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Material
                </Typography>
                <Box>{project.material}</Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Montage
                </Typography>
                <Box>{project.assembly}</Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Oberfläche
                </Typography>
                <Box>{project.surface}</Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Brandschutz
                </Typography>
                {project.fireProtection && (
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                    <Check />
                    <Typography variant="body1">{project.fireProtectionOption}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  EN 1090
                </Typography>
                {project.en1090 && (
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                    <Check />
                    <Typography variant="body1">{project.en1090Option}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Kalkulation
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Geleistete Stunden, pro Tag, Woche, Monat, Gesamt
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

function googleMapsLink(object: ProjectObject) {
  return `https://www.google.com/maps/search/?api=1&query=${object?.address}+${object?.zipCode}+${object?.city}`
}

function ContactsCard({ project }: { project: Project }) {
  const customer = project.customer ? (
    <>
      <Typography gutterBottom variant="h6" component="div">
        Auftraggeber
      </Typography>
      <Typography gutterBottom variant="body1" component="div">
        {project.customer.company} {project.customer.firstName} {project.customer.lastName}
      </Typography>
    </>
  ) : undefined

  const architect = project.architect ? (
    <>
      <Typography gutterBottom variant="h6" component="div">
        Architekt
      </Typography>
      <Typography gutterBottom variant="body1" component="div">
        {project.architect.company} {project.architect.firstName} {project.architect.lastName}
      </Typography>
    </>
  ) : undefined

  const builder = project.builder ? (
    <>
      <Typography gutterBottom variant="h6" component="div">
        Bauherr
      </Typography>
      <Typography gutterBottom variant="body1" component="div">
        {project.builder.company} {project.builder.firstName} {project.builder.lastName}
      </Typography>
    </>
  ) : undefined

  const constructionManagement = project.constructionManagement ? (
    <>
      <Typography gutterBottom variant="h6" component="div">
        Bauleiter
      </Typography>
      <Typography gutterBottom variant="body1" component="div">
        {project.constructionManagement.company} {project.constructionManagement.firstName}{' '}
        {project.constructionManagement.lastName}
      </Typography>
    </>
  ) : undefined

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Kontakte
        </Typography>

        {customer}
        {constructionManagement}
        {architect}
        {builder}
      </CardContent>
    </Card>
  )
}

// material: string
//   assembly: string
//   surface: string
//   fireProtection: string
//   en1090: string
//   deadline?: IsoDateString

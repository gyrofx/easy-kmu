import { apiClient } from '@/client/api/client'
import { ContactAutocomplete } from '@/client/domain/contacts/ContactAutocomplete'
import { EmployeeAutocomplete } from '@/client/domain/employee/EmployeeAutocomplete'
import { useProjectStore } from '@/client/domain/projects/ProjectStore'
import { useRouter } from '@/client/router/useRouter'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material'
import { useQuery } from 'react-query'
// import { ListChildComponentProps, VariableSizeList } from 'react-window'

export function AddProjects() {
  const query = useQuery({ queryKey: ['contacts'], queryFn: apiClient.listContacts })
  const queryEmployees = useQuery({ queryKey: ['employees'], queryFn: apiClient.listEmployees })
  const { navigateToProject } = useRouter()
  const { project, setInitialProject, setValue, clear } = useProjectStore()

  if (query.isLoading || queryEmployees.isLoading) return <LinearProgress />
  if (query.isError || queryEmployees.isError) return <div>Error</div>
  const contacts = query.data?.body || []
  const employees = queryEmployees.data?.body || []

  return (
    <Container>
      <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography gutterBottom variant="h3" component="div">
          Neues Projekt erstellen
        </Typography>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Projektbeschreibung
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Titel"
              type="text"
              fullWidth
              variant="standard"
              value={project.name}
              onChange={(event) => setValue('name', event.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Beschreibung"
              type="text"
              fullWidth
              variant="standard"
              value={project.description}
              onChange={(event) => setValue('description', event.target.value)}
            />

            <TextField
              autoFocus
              margin="dense"
              label="Termin"
              type="text"
              fullWidth
              variant="standard"
              // value={contact.company}
              // onChange={(event) => setCompany(event.target.value)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Beteiligte
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <ContactAutocomplete
                contacts={contacts}
                label="Auftraggeber"
                onContactChange={(contact) => {
                  setValue('customerContactId', contact?.id)
                }}
              />
              <TextField
                autoFocus
                margin="dense"
                label="Objekt"
                type="text"
                fullWidth
                variant="standard"
                // value={contact.company}
                // onChange={(event) => setCompany(event.target.value)}
              />
              <ContactAutocomplete
                contacts={contacts}
                label="Bauleiter"
                onContactChange={(contact) => {
                  setValue('constructionManagementContactId', contact?.id)
                }}
              />
              <ContactAutocomplete
                contacts={contacts}
                label="Architekt"
                onContactChange={(contact) => {
                  setValue('architectContactId', contact?.id)
                }}
              />
              <ContactAutocomplete
                contacts={contacts}
                label="Bauherr"
                onContactChange={(contact) => {
                  setValue('builderContactId', contact?.id)
                }}
              />
              <EmployeeAutocomplete
                employees={employees}
                label="Sachbearbeiter"
                onChange={(employee) => {
                  setValue('clerkEmployeeId', employee?.id)
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Material
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label=""
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={4}
              value={project.material}
              onChange={(event) => setValue('material', event.target.value)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Montage
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label=""
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={4}
              value={project.assembly}
              onChange={(event) => setValue('assembly', event.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Oberfläche
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label=""
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={4}
              value={project.surface}
              onChange={(event) => setValue('surface', event.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Brandschutz
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label=""
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={4}
              value={project.fireProtection}
              onChange={(event) => setValue('fireProtection', event.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              EN 1090
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label=""
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={4}
              value={project.en1090}
              onChange={(event) => setValue('en1090', event.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Bemerkungen
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label=""
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={10}
              value={project.notes}
              onChange={(event) => setValue('notes', event.target.value)}
            />
          </CardContent>
        </Card>
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            console.log('project', project)
            const response = await apiClient.createOrUpdateProject({ body: project })
            if (response.status === 200) navigateToProject(response.body)
          }}
        >
          Speichern
        </Button>
      </Box>
    </Container>
  )
}

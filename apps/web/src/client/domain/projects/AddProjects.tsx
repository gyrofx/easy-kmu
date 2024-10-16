import { apiClient } from '@/client/api/client'
import { ContactAutocomplete } from '@/client/domain/contacts/ContactAutocomplete'
import { EmployeeAutocomplete } from '@/client/domain/employee/EmployeeAutocomplete'
import { type ProjectKeys, useProjectStore } from '@/client/domain/projects/ProjectStore'
import { useRouter } from '@/client/router/useRouter'
import type { Contact } from '@/common/models/contact'
import { Add, Clear } from '@mui/icons-material'
import { useContactsQuery } from '@/client/domain/contacts/useContactsQuery'
import { useEmployeesQuery } from '@/client/domain/employee/useEmployeesQuery'
import { ObjectAutocomplete } from '@/client/domain/projectObjects/ObjectAutocomplete'
import { useQbjectsQuery } from '@/client/domain/projectObjects/useObjectsQuery'
import type { Employee } from '@/common/models/employee'
import type { ProjectObject } from '@/common/models/projectObject'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useProjectQuery } from '@/client/domain/projects/useProjectQuery'
import {
  asEN1090Option,
  asFireProtectionOption,
  type CreateOrUpdateProject,
} from '@/common/models/project'
import { useParams } from 'react-router-dom'
import { RalAutocomplete } from '@/client/domain/projects/RalAutocomplete'
import { PageContainer, PageContainerToolbar } from '@toolpad/core'

function ProjectsToolbar() {
  const { navigateToAddProjects } = useRouter()

  return (
    <PageContainerToolbar>
      <IconButton color="primary" onClick={navigateToAddProjects}>
        <Add />
      </IconButton>
    </PageContainerToolbar>
  )
}

export function UpdateProjectView() {
  return (
    <PageContainer slots={{ toolbar: ProjectsToolbar }}>
      <UpdateProjectViewInner />
    </PageContainer>
  )
}

function UpdateProjectViewInner() {
  const { projectId } = useParams()
  const projectQuery = useProjectQuery(projectId || '')

  if (!projectId) return <h1>Project ID is missing</h1>
  if (projectQuery.isLoading) return <h1>Loading...</h1>
  if (projectQuery.error) return <h1>Error</h1>

  const project = projectQuery.data
  if (!project) return <h1>Project not found</h1>

  return <CreateOrUpdateProjectView project={project} />
}

export function CreateProjectView() {
  return (
    <PageContainer
      breadCrumbs={[
        { title: 'Home', path: '/' },
        { title: 'Neues Projekt', path: '' },
      ]}
      title="Neues Projekt"
      slots={{ toolbar: ProjectsToolbar }}
    >
      <CreateProjectViewInner />
    </PageContainer>
  )
}

export function CreateProjectViewInner() {
  return <CreateOrUpdateProjectView />
}

function CreateOrUpdateProjectView({ project }: { project?: CreateOrUpdateProject }) {
  const contactsQuery = useContactsQuery()
  const objectsQuery = useQbjectsQuery()
  const employeesQuery = useEmployeesQuery()

  const { setInitialProject, clear } = useProjectStore()

  useEffect(() => {
    if (project) setInitialProject(project)
  }, [project, setInitialProject])

  if (contactsQuery.isLoading || employeesQuery.isLoading || objectsQuery.isLoading)
    return <LinearProgress />
  if (contactsQuery.isError || employeesQuery.isError || objectsQuery.isError) return <div>Error</div>

  const contacts = contactsQuery.data || []
  const employees = employeesQuery.data || []
  const objects = objectsQuery.data || []

  return (
    // <Container>
    <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography gutterBottom variant="h3" component="div">
            {project ? `Projekt ${project.name} bearbeiten` : 'Neues Projekt erstellen'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="primary" onClick={clear}>
              <Clear />
            </IconButton>
          </Box>
        </Box> */}

      <ProjectDescriptionCard employees={employees} />

      <ObjectCard objects={objects} />

      <ContactsCard contacts={contacts} />

      <MaterialCard />
      <AsselmblyCard />
      <SurfaceCard />
      <FireProtectionCard />
      <En1090Card />
      <NotesCard />

      <ActionButtons />
    </Box>
    // </Container>
  )
}

function ProjectDescriptionCard({ employees }: { employees: Employee[] }) {
  const { project, setValue } = useProjectStore()

  return (
    <CardWrapper title="Projektbeschreibung">
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 3 }}>
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
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1 }}>
          <EmployeeAutocomplete
            employees={employees}
            label="Projektleiter"
            onChange={(employee) => {
              setValue('projectManagerEmployeeId', employee?.id)
            }}
            value={project.projectManagerEmployeeId}
          />

          <EmployeeAutocomplete
            employees={employees}
            label="Sachbearbeiter"
            onChange={(employee) => {
              setValue('clerkEmployeeId', employee?.id)
            }}
            value={project.clerkEmployeeId}
          />
        </Box>
      </Box>
    </CardWrapper>
  )
}

function ObjectCard({ objects }: { objects: ProjectObject[] }) {
  const { setValue, project } = useProjectStore()

  return (
    <CardWrapper title="Objekt">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ObjectAutocomplete
          sx={{ flexGrow: 1 }}
          objects={objects}
          label="Objekt"
          value={project.objectId}
          onObjectChange={(obj) => setValue('objectId', obj?.id)}
        />
      </Box>
    </CardWrapper>
  )
}

function ContactsCard({ contacts }: { contacts: Contact[] }) {
  const { setValue, project } = useProjectStore()

  return (
    <CardWrapper title="Kontakte">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <ContactAutocomplete
          sx={{ flexGrow: 1 }}
          contacts={contacts}
          label="Auftraggeber"
          value={project.customerContactId}
          onContactChange={(contact) => setValue('customerContactId', contact?.id)}
        />
        <ContactAutocomplete
          sx={{ flexGrow: 1 }}
          contacts={contacts}
          label="Bauleiter"
          value={project.constructionManagementContactId}
          onContactChange={(contact) => setValue('constructionManagementContactId', contact?.id)}
        />
        <ContactAutocomplete
          sx={{ flexGrow: 1 }}
          contacts={contacts}
          label="Architekt"
          value={project.architectContactId}
          onContactChange={(contact) => setValue('architectContactId', contact?.id)}
        />
        <ContactAutocomplete
          sx={{ flexGrow: 1 }}
          contacts={contacts}
          label="Bauherr"
          value={project.builderContactId}
          onContactChange={(contact) => setValue('builderContactId', contact?.id)}
        />
        <TextField
          autoFocus
          margin="dense"
          label="Kunden Referenz"
          type="text"
          fullWidth
          variant="standard"
          multiline
          value={project.customerReference}
          onChange={(event) => setValue('customerReference', event.target.value)}
        />
      </Box>
    </CardWrapper>
  )
}

function MaterialCard() {
  return <MultilineTextCard title="Material" propertyName="material" rows={4} />
}

function AsselmblyCard() {
  return <MultilineTextCard title="Montage" propertyName="assembly" rows={4} />
}

function SurfaceCard() {
  const { project, setValue } = useProjectStore()

  return (
    <MultilineTextCard title="Oberfläche" propertyName="surface" rows={4}>
      <RalAutocomplete
        label="Farbe"
        value={project.surfaceColor}
        onChange={(c) => setValue('surfaceColor', c)}
      />
    </MultilineTextCard>
  )
}

function FireProtectionCard() {
  const { project, setValue } = useProjectStore()

  return (
    <CardWrapper title="Brandschutz">
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Checkbox
          onChange={(ev) => setValue('fireProtection', ev.target.checked)}
          checked={project.fireProtection}
        />

        <FormControl sx={{ display: 'flex', flexDirection: 'row' }} disabled={!project.fireProtection}>
          <RadioGroup
            value={project.fireProtectionOption}
            onChange={(ev) => {
              setValue('fireProtectionOption', asFireProtectionOption(ev.target.value))
            }}
            row
          >
            <FormControlLabel value="level1" control={<Radio />} label="Level 1" />
            <FormControlLabel value="level2" control={<Radio />} label="Level 2" />
            <FormControlLabel value="level3" control={<Radio />} label="Level 3" />
          </RadioGroup>
        </FormControl>
      </Box>
    </CardWrapper>
  )
}

function En1090Card() {
  const { project, setValue } = useProjectStore()

  return (
    <CardWrapper title="EN1090">
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Checkbox onChange={(ev) => setValue('en1090', ev.target.checked)} checked={project.en1090} />

        <FormControl sx={{ display: 'flex', flexDirection: 'row' }} disabled={!project.en1090}>
          <RadioGroup
            value={project.en1090Option}
            onChange={(ev) => {
              setValue('en1090Option', asEN1090Option(ev.target.value))
            }}
            row
          >
            <FormControlLabel value="ex1" control={<Radio />} label="EX 1" />
            <FormControlLabel value="ex2" control={<Radio />} label="EX 2" />
            <FormControlLabel value="ex3" control={<Radio />} label="EX 3" />
          </RadioGroup>
        </FormControl>
      </Box>
    </CardWrapper>
  )
}

function NotesCard() {
  return <MultilineTextCard title="Notizen" propertyName="notes" rows={10} />
}

function ActionButtons() {
  const { project } = useProjectStore()
  const { navigateToProject } = useRouter()

  return (
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
  )
}

function MultilineTextCard({
  title,
  propertyName,
  rows,
  children,
}: { title: string; propertyName: ProjectKeys; rows: number; children?: React.ReactNode }) {
  const { project, setValue } = useProjectStore()
  return (
    <CardWrapper title={title}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          autoFocus
          margin="dense"
          label=""
          type="text"
          fullWidth
          variant="standard"
          multiline
          rows={rows}
          value={project[propertyName]}
          onChange={(event) => setValue(propertyName, event.target.value)}
        />
        {children}
      </Box>
    </CardWrapper>
  )
}

function CardWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  )
}

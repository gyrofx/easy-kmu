import { apiClient } from '@/client/api/client'
import { ContactAutocomplete } from '@/client/domain/contacts/ContactAutocomplete'
import { PersonAutocomplete } from '@/client/domain/contacts/PersonAutocomplete'
import { EmployeeAutocomplete } from '@/client/domain/employee/EmployeeAutocomplete'
import { type ProjectKeys, useProjectStore } from '@/client/domain/projects/ProjectStore'
import { useRouter } from '@/client/router/useRouter'
import type { Contact } from '@/common/models/contact'
import { Add, Delete } from '@mui/icons-material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

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
  Container,
  IconButton,
  LinearProgress,
  type SxProps,
  TextField,
  type Theme,
  Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { parseISO } from 'date-fns'
import { useEffect, useState } from 'react'

export function AddProjects() {
  const contactsQuery = useContactsQuery()
  const objectsQuery = useQbjectsQuery()
  const employeesQuery = useEmployeesQuery()

  const { navigateToProject } = useRouter()
  const { project } = useProjectStore()

  if (contactsQuery.isLoading || employeesQuery.isLoading || objectsQuery.isLoading)
    return <LinearProgress />
  if (contactsQuery.isError || employeesQuery.isError || objectsQuery.isError) return <div>Error</div>

  const contacts = contactsQuery.data || []
  const employees = employeesQuery.data || []
  const objects = objectsQuery.data || []

  console.log('project', project)

  return (
    <Container>
      <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography gutterBottom variant="h3" component="div">
          Neues Projekt erstellen
        </Typography>

        <ProjectDescriptionCard employees={employees} />

        <ObjectCard objects={objects} />

        <CustomrCard contacts={contacts} />
        <ConstructionManagementCard contacts={contacts} />
        <ArchitectCard contacts={contacts} />
        <BuilderCard contacts={contacts} />

        <MaterialCard />
        <AsselmblyCard />
        <SurfaceCard />
        <FireProtectionCard />
        <En1090Card />
        <NotesCard />

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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Termin"
              value={project.deadline ? parseISO(project.deadline) : null}
              onChange={(value) => setValue('deadline', value?.toISOString())}
            />
          </LocalizationProvider>
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
          onContactChange={(obj) => setValue('objectId', obj?.id)}
        />
      </Box>
    </CardWrapper>
  )
}

function CustomrCard({ contacts }: { contacts: Contact[] }) {
  return (
    <CardWrapper title="Auftraggeber">
      <ContactWithPersonsInCharge
        contacts={contacts}
        label="Auftraggeber"
        contactIdPropertyName="customerContactId"
        personsInChargePropertyName="customerPersonsInCharge"
      />
    </CardWrapper>
  )
}

function ConstructionManagementCard({ contacts }: { contacts: Contact[] }) {
  return (
    <CardWrapper title="Bauleiter">
      <ContactWithPersonsInCharge
        contacts={contacts}
        label="Bauleiter"
        contactIdPropertyName="constructionManagementContactId"
        personsInChargePropertyName="constructionManagementPersonsInCharge"
      />
    </CardWrapper>
  )
}

function ArchitectCard({ contacts }: { contacts: Contact[] }) {
  return (
    <CardWrapper title="Architekt">
      <ContactWithPersonsInCharge
        contacts={contacts}
        label="Architekt"
        contactIdPropertyName="architectContactId"
        personsInChargePropertyName="architectPersonsInCharge"
      />
    </CardWrapper>
  )
}

function BuilderCard({ contacts }: { contacts: Contact[] }) {
  return (
    <CardWrapper title="Bauherr">
      <ContactWithPersonsInCharge
        contacts={contacts}
        label="Bauherr"
        contactIdPropertyName="builderContactId"
        personsInChargePropertyName="builderPersonsInCharge"
      />
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
  return <MultilineTextCard title="Oberfläche" propertyName="surface" rows={4} />
}

function FireProtectionCard() {
  return <MultilineTextCard title="Brandschutz" propertyName="fireProtection" rows={4} />
}

function En1090Card() {
  return <MultilineTextCard title="EN 1090" propertyName="en1090" rows={4} />
}

function NotesCard() {
  return <MultilineTextCard title="Notizen" propertyName="notes" rows={10} />
}

function MultilineTextCard({
  title,
  propertyName,
  rows,
}: { title: string; propertyName: ProjectKeys; rows: number }) {
  const { project, setValue } = useProjectStore()
  return (
    <CardWrapper title={title}>
      <TextField
        autoFocus
        margin="dense"
        label=""
        type="text"
        fullWidth
        variant="standard"
        multiline
        rows={rows}
        value={project.assembly}
        onChange={(event) => setValue(propertyName, event.target.value)}
      />
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

function PersonsInCharge({
  contacts,
  contactId,
  personsInCharge,
  setPersonInChargeValue,
  addPersonInCharge,
  removePersonInCharge,
  sx,
}: {
  contacts: Contact[]
  contactId: string | undefined
  personsInCharge: string[]
  setPersonInChargeValue: (value: string, index: number) => void
  addPersonInCharge: () => void
  removePersonInCharge: (index: number) => void
  sx?: SxProps<Theme>
}) {
  const [selcetedContact, setSelectedContact] = useState<Contact | undefined>(undefined)

  useEffect(() => {
    setSelectedContact(contacts.find((contact) => contact.id === contactId))
  }, [contactId, contacts])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, ...sx }}>
      {personsInCharge.map((personInCharge, index) => {
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Box key={index} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            {selcetedContact?.persons.length && (
              <PersonAutocomplete
                sx={{ flexGrow: 1 }}
                persons={selcetedContact?.persons || []}
                label="Ansprechpartner"
                value={personInCharge}
                onChange={(value) => {
                  console.log('personInCharge', personInCharge)
                  setPersonInChargeValue(value || '', index)
                }}
              />
            )}
            {!selcetedContact?.persons.length && (
              <TextField
                // sx={{ flexGrow: 1 }}
                fullWidth
                autoFocus
                margin="dense"
                label="Ansprechpartner (Freitext)"
                type="text"
                variant="standard"
                value={personInCharge}
                onChange={(event) => setPersonInChargeValue(event.target.value, index)}
              />
            )}

            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <IconButton onClick={() => removePersonInCharge(index)}>
                <Delete />
              </IconButton>
            </Box>
          </Box>
        )
      })}

      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <IconButton onClick={() => addPersonInCharge()}>
          <Add />
        </IconButton>
      </Box>
    </Box>
  )
}

interface ContactWithPersonsInChargeProps {
  contacts: Contact[]
  label: string
  contactIdPropertyName:
    | 'customerContactId'
    | 'constructionManagementContactId'
    | 'architectContactId'
    | 'builderContactId'
  personsInChargePropertyName:
    | 'customerPersonsInCharge'
    | 'constructionManagementPersonsInCharge'
    | 'architectPersonsInCharge'
    | 'builderPersonsInCharge'
}

function ContactWithPersonsInCharge(props: ContactWithPersonsInChargeProps) {
  const { contacts, label, contactIdPropertyName, personsInChargePropertyName } = props

  const { project, setValue, addArrayValue, setArrayValue, removeArrayValue } = useProjectStore()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <ContactAutocomplete
        sx={{ flexGrow: 1 }}
        contacts={contacts}
        label={label}
        value={project[contactIdPropertyName]}
        onContactChange={(contact) => setValue(contactIdPropertyName, contact?.id)}
      />
      <PersonsInCharge
        sx={{ flexGrow: 1 }}
        contacts={contacts}
        contactId={project[contactIdPropertyName]}
        personsInCharge={project[personsInChargePropertyName] || []}
        setPersonInChargeValue={(value, index) =>
          setArrayValue(personsInChargePropertyName, index, value)
        }
        addPersonInCharge={() => addArrayValue(personsInChargePropertyName, '')}
        removePersonInCharge={(index) => removeArrayValue(personsInChargePropertyName, index)}
      />
    </Box>
  )
}

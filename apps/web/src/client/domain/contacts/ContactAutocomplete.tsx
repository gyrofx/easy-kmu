import type { Contact } from '@/common/models/contact'
import { Autocomplete, Box, TextField, type Theme, Typography } from '@mui/material'
import type { SxProps } from '@mui/material/styles'
import { useEffect, useState } from 'react'

export function ContactAutocomplete({
  value,
  contacts,
  label,
  onContactChange,
  sx,
}: {
  value: string | undefined
  contacts: Contact[]
  label: string
  onContactChange: (contact: Contact | undefined) => void
  sx?: SxProps<Theme>
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<Contact[]>([])
  const [selcetedContact, setSelectedContact] = useState<Contact | null>(null)

  useEffect(() => {
    if (searchQuery.length < 3) setFilteredData([])
    else {
      setFilteredData(
        contacts.filter(
          (contact) =>
            contact.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    }
  }, [contacts, searchQuery])

  useEffect(() => {
    if (value) {
      const contact = contacts.find((contact) => contact.id === value) || null
      setSelectedContact(contact)
      console.log('setSelectedContact', contact)
    } else setSelectedContact(null)
  }, [value, contacts])

  return (
    <Autocomplete
      sx={sx}
      options={filteredData}
      filterOptions={(x) => x}
      noOptionsText="Keine Ergebnisse. Bitte Suche eingeben"
      autoHighlight
      onInputChange={(_event, newInputValue) => {
        setSearchQuery(newInputValue)
      }}
      getOptionKey={(option) => option.id}
      getOptionLabel={optionLabel}
      renderOption={(props, option) => {
        const { id, key, ...optionProps } = props
        return (
          <Box key={id} component="li" {...optionProps}>
            <Option contact={option} />
          </Box>
        )
      }}
      value={selcetedContact}
      onChange={(_event, contact) => {
        onContactChange(contact ? contact : undefined)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
    />
  )
}

function Option({ contact }: { contact: Contact }) {
  const { address, zipCode, city } = contact
  const label = contactAsLabel(contact)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body1">{label}</Typography>
      <Typography variant="body2" color="text.secondary">
        {address}, {zipCode} {city}
      </Typography>
    </Box>
  )
}

function contactAsLabel(contact: Contact) {
  const { company, firstName, lastName } = contact
  return company && firstName && lastName
    ? `${contact.company} - ${contact.firstName} ${contact.lastName}`
    : company
      ? `${contact.company}`
      : `${contact.firstName} ${contact.lastName}`
}

function optionLabel(contact: Contact) {
  return `${contactAsLabel(contact)}, ${contact.address} ${contact.zipCode} ${contact.city}`
}

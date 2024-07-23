import type { Contact } from '@/common/models/contact'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

export function ContactAutocomplete({
  contacts,
  label,
  onContactChange,
}: {
  contacts: Contact[]
  label: string
  onContactChange: (contact: Contact | undefined) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<Contact[]>([])

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

  return (
    <Autocomplete
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

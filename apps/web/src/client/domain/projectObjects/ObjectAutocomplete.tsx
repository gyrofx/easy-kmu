import type { ProjectObject } from '@/common/models/projectObject'
import { Autocomplete, Box, type SxProps, TextField, type Theme, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

export function ObjectAutocomplete({
  value,
  objects,
  label,
  onObjectChange,
  sx,
}: {
  value: string | undefined
  objects: ProjectObject[]
  label: string
  onObjectChange: (contact: ProjectObject | undefined) => void
  sx?: SxProps<Theme>
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<ProjectObject[]>([])
  const [selcetedObject, setSelectedObject] = useState<ProjectObject | null>(null)

  useEffect(() => {
    if (searchQuery.length < 3) setFilteredData([])
    else {
      setFilteredData(
        objects.filter(
          (contact) =>
            contact.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.zipCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.city.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    }
  }, [objects, searchQuery])

  console.log('ObjectAutocomplete.selectedObject', {
    selcetedObject,
    value,
    o: objects.map(({ id }) => id).slice(0, 10),
    o2: objects.find((obj) => obj.id === value),
  })

  useEffect(() => {
    console.log('ObjectAutocomplete.useEffect')
    if (value) {
      const objForValue = objects.find((obj) => obj.id === value) || null
      setSelectedObject(objForValue)
      console.log(
        'ObjectAutocomplete.useEffect >>>',
        objForValue,
        value,
        objects.find((obj) => obj.id === value),
      )
    }
    setSelectedObject(null)
  }, [value, objects])

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
            <Option obj={option} />
          </Box>
        )
      }}
      value={selcetedObject}
      onChange={(_event, obj) => {
        console.log('ObjectAutocomplete.onChange', obj)
        onObjectChange(obj ? obj : undefined)
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

function Option({ obj }: { obj: ProjectObject }) {
  const { address, zipCode, city } = obj

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body1">
        {/* <Typography variant="body2" color="text.secondary"> */}
        {address}, {zipCode} {city}
      </Typography>
    </Box>
  )
}

function optionLabel(contact: ProjectObject) {
  return `${contact.address} ${contact.zipCode} ${contact.city}`
}

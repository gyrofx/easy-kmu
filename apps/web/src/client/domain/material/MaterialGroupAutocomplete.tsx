import type { MaterialGroup } from '@/common/models/material'
import { Autocomplete, Box, TextField, type Theme, Typography } from '@mui/material'
import type { SxProps } from '@mui/material/styles'
import { useEffect, useState } from 'react'

export function MaterialGroupAutocomplete({
  value,
  groups,
  label,
  onObjectChange,
  sx,
}: {
  value: string | undefined
  groups: MaterialGroup[]
  label: string
  onObjectChange: (contact: MaterialGroup | undefined) => void
  sx?: SxProps<Theme>
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredData, setFilteredData] = useState<MaterialGroup[]>([])
  const [selcetedObject, setSelectedObject] = useState<MaterialGroup | null>(null)

  useEffect(() => {
    if (searchQuery.length === 0) setFilteredData(groups)
    else {
      setFilteredData(
        groups.filter((group) => group.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }
  }, [groups, searchQuery])

  useEffect(() => {
    if (value) {
      const objForValue = groups.find((obj) => obj.id === value) || null
      setSelectedObject(objForValue)
      console.log(
        'ObjectAutocomplete.useEffect >>>',
        objForValue,
        value,
        groups.find((obj) => obj.id === value),
      )
    }
    setSelectedObject(null)
  }, [value, groups])

  return (
    <Autocomplete
      sx={sx}
      options={groups}
      // filterOptions={(x) => x}
      noOptionsText="Keine Ergebnisse. Bitte Suche eingeben"
      autoHighlight
      // onInputChange={(_event, newInputValue) => {
      //   setSearchQuery(newInputValue)
      // }}
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
      // value={selcetedObject}
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

function Option({ obj }: { obj: MaterialGroup }) {
  const { name } = obj

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body1">
        {/* <Typography variant="body2" color="text.secondary"> */}
        {name}
      </Typography>
    </Box>
  )
}

function optionLabel(group: MaterialGroup) {
  return `${group.name}`
}

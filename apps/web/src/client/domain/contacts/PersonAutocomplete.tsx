import type { Person } from '@/common/models/contact'
import { truthy } from '@easy-kmu/common'
import { Autocomplete, Box, type SxProps, TextField, type Theme, Typography } from '@mui/material'

export function PersonAutocomplete({
  value,
  persons,
  label,
  onChange,
  sx,
}: {
  value: string
  persons: Person[]
  label: string
  onChange: (employee: string | undefined) => void
  sx?: SxProps<Theme>
}) {
  return (
    <Autocomplete
      sx={sx}
      selectOnFocus
      clearOnBlur
      options={persons.map(optionLabel)}
      noOptionsText="Keine Ergebnisse."
      autoHighlight
      freeSolo={true}
      // getOptionKey={(option) => option.id}
      // getOptionLabel={optionLabel}
      renderOption={(props, option) => {
        const { id, key, ...optionProps } = props
        return (
          <Box key={id} component="li" {...optionProps}>
            <Typography variant="body1">{option}</Typography>
          </Box>
        )
      }}
      value={value}
      onChange={(_event, persons) => {
        onChange(persons ? persons : undefined)
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

function Option({ person }: { person: Person }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body1">{optionLabel(person)}</Typography>
    </Box>
  )
}

function optionLabel(person: Person) {
  const { name, role, email, phone1, phone2 } = person

  return [name, role, email, phone1, phone2].filter(truthy).join(', ')
}

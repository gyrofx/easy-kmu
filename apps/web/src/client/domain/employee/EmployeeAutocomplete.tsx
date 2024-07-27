import type { Employee } from '@/common/models/employee'
import { Autocomplete, Box, TextField, Typography } from '@mui/material'

export function EmployeeAutocomplete({
  employees,
  label,
  onChange,
}: {
  employees: Employee[]
  label: string
  onChange: (employee: Employee | undefined) => void
}) {
  return (
    <Autocomplete
      options={employees}
      noOptionsText="Keine Ergebnisse. Bitte Suche eingeben"
      autoHighlight
      getOptionKey={(option) => option.id}
      getOptionLabel={optionLabel}
      renderOption={(props, option) => {
        const { id, key, ...optionProps } = props
        return (
          <Box key={id} component="li" {...optionProps}>
            <Option employee={option} />
          </Box>
        )
      }}
      onChange={(_event, empployee) => {
        onChange(empployee ? empployee : undefined)
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

function Option({ employee }: { employee: Employee }) {
  const { firstName, lastName } = employee

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography variant="body1">
        {firstName} {lastName}
      </Typography>
    </Box>
  )
}

function optionLabel(employee: Employee) {
  return `${employee.firstName} ${employee.lastName}`
}

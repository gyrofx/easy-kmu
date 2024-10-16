import { Autocomplete, Box, createFilterOptions, TextField, type Theme, Typography } from '@mui/material'
import type { SxProps } from '@mui/material/styles'
import { ralList } from './ral'
import { useEffect, useState } from 'react'
import { Circle } from '@mui/icons-material'

const filter = createFilterOptions<RalOption>()

export function RalAutocomplete({
  value,
  label,
  onChange,
  sx,
}: {
  value: string
  label: string
  onChange: (surfaceColor: string | undefined) => void
  sx?: SxProps<Theme>
}) {
  const [ralValue, setRalValue] = useState<RalOption | null>(null)

  useEffect(() => {
    setRalValue(
      value
        ? ralList.find(({ ral }) => ral === value) || { ral: value, hex: '#000000', de: value }
        : null,
    )
  }, [value])

  return (
    <Autocomplete
      sx={sx}
      selectOnFocus
      clearOnBlur
      options={options()}
      noOptionsText="Keine Ergebnisse."
      autoHighlight
      freeSolo={true}
      // getOptionKey={(option) => option.id}
      filterOptions={(options, params) => {
        const filtered = filter(options, params)

        const { inputValue } = params
        const isExisting = options.some((option) => inputValue === option.ral)
        if (inputValue !== '' && !isExisting) {
          filtered.push({ inputValue, ral: inputValue, de: '', hex: '#000000' })
        }

        return filtered
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue
        }
        // Regular option
        return option.ral
      }}
      renderOption={(props, option) => {
        const { id, key, ...optionProps } = props
        return (
          <Box key={id} component="li" {...optionProps} sx={{ gap: 2 }}>
            <Typography variant="body1" sx={{ color: option.hex }}>
              <Circle />
            </Typography>
            <Typography variant="body1">{`${option.ral} - ${option.de}`}</Typography>
          </Box>
        )
      }}
      value={ralValue}
      onChange={(_event, ral) => {
        if (typeof ral === 'string') onChange(ral)
        else onChange(ral ? ral.ral : undefined)
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} inputProps={{ ...params.inputProps }} />
      )}
    />
  )
}

function options(): RalOption[] {
  return ralList
}

interface RalOption {
  ral: string
  hex: string
  de: string
  inputValue?: string
}
